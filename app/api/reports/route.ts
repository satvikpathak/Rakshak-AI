import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, WidthType, BorderStyle, AlignmentType, HeadingLevel, PageOrientation, Footer, Header } from 'docx';
import { saveAs } from 'file-saver';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

interface SecurityData {
  date: string;
  area: string;
  incidents: number;
  weaponDetections: number;
  behaviorAnomalies: number;
  suspiciousFaces: number;
  riskLevel: 'Low' | 'Medium' | 'High' | 'Critical';
  alertsTriggered: number;
}

interface ReportRequest {
  reportType: 'daily' | 'weekly' | 'monthly';
  startDate: string;
  endDate: string;
  areas?: string[];
}

// Mock data generator - replace with actual database queries
function generateMockSecurityData(reportType: string, startDate: string, endDate: string): SecurityData[] {
  const areas = ['Main Entrance', 'Parking Area', 'Lobby', 'Corridor A', 'Corridor B', 'Emergency Exit', 'Cafeteria', 'Server Room'];
  const data: SecurityData[] = [];
  
  const start = new Date(startDate);
  const end = new Date(endDate);
  const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  
  for (let i = 0; i <= days; i++) {
    const currentDate = new Date(start);
    currentDate.setDate(start.getDate() + i);
    
    areas.forEach(area => {
      const incidents = Math.floor(Math.random() * 10);
      const weaponDetections = Math.floor(Math.random() * 3);
      const behaviorAnomalies = Math.floor(Math.random() * 15);
      const suspiciousFaces = Math.floor(Math.random() * 5);
      const alertsTriggered = incidents + weaponDetections + Math.floor(behaviorAnomalies / 3);
      
      let riskLevel: 'Low' | 'Medium' | 'High' | 'Critical' = 'Low';
      if (alertsTriggered > 15) riskLevel = 'Critical';
      else if (alertsTriggered > 10) riskLevel = 'High';
      else if (alertsTriggered > 5) riskLevel = 'Medium';
      
      data.push({
        date: currentDate.toISOString().split('T')[0],
        area,
        incidents,
        weaponDetections,
        behaviorAnomalies,
        suspiciousFaces,
        riskLevel,
        alertsTriggered
      });
    });
  }
  
  return data;
}

async function generateAIAnalysis(data: SecurityData[], reportType: string): Promise<string> {
  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
  
  const dataSummary = {
    totalIncidents: data.reduce((sum, d) => sum + d.incidents, 0),
    totalWeaponDetections: data.reduce((sum, d) => sum + d.weaponDetections, 0),
    totalBehaviorAnomalies: data.reduce((sum, d) => sum + d.behaviorAnomalies, 0),
    totalSuspiciousFaces: data.reduce((sum, d) => sum + d.suspiciousFaces, 0),
    highRiskAreas: data.filter(d => d.riskLevel === 'High' || d.riskLevel === 'Critical').map(d => d.area),
    averageAlertsPerDay: data.reduce((sum, d) => sum + d.alertsTriggered, 0) / data.length
  };
  
  const prompt = `
  As a security analyst, analyze this ${reportType} security surveillance data and provide insights:
  
  Summary Statistics:
  - Total Incidents: ${dataSummary.totalIncidents}
  - Total Weapon Detections: ${dataSummary.totalWeaponDetections}
  - Total Behavior Anomalies: ${dataSummary.totalBehaviorAnomalies}
  - Total Suspicious Faces: ${dataSummary.totalSuspiciousFaces}
  - Average Alerts Per Day: ${dataSummary.averageAlertsPerDay.toFixed(2)}
  - High Risk Areas: ${dataSummary.highRiskAreas.join(', ')}
  
  Please provide:
  1. Key findings and trends
  2. Areas of concern that need immediate attention
  3. Recommendations for security improvements
  4. Risk assessment summary
  5. Suggested patrol schedules or security measures
  
  Keep the analysis professional and actionable, around 300-400 words.
  `;
  
  const result = await model.generateContent(prompt);
  const response = await result.response;
  return response.text();
}

async function createWordReport(data: SecurityData[], analysis: string, reportType: string): Promise<Buffer> {
  const doc = new Document({
    styles: {
      default: {
        heading1: {
          run: { size: 36, bold: true, color: '2F5496', font: 'Calibri' },
          paragraph: { spacing: { after: 200 }, alignment: AlignmentType.CENTER }
        },
        heading2: {
          run: { size: 28, bold: true, color: '2F5496', font: 'Calibri' },
          paragraph: { spacing: { before: 200, after: 100 } }
        },
        document: {
          run: { size: 24, font: 'Calibri' },
          paragraph: { spacing: { after: 150 } }
        }
      }
    },
    sections: [{
      properties: { page: { orientation: PageOrientation.PORTRAIT, margins: { top: 720, right: 720, bottom: 720, left: 720 } } },
      headers: {
        default: new Header({
          children: [
            new Paragraph({
              children: [
                new TextRun({ text: `Security Surveillance ${reportType.toUpperCase()} Report`, bold: true, size: 24, color: '2F5496' }),
                new TextRun({ text: ` | Generated: ${new Date().toLocaleDateString()}`, size: 20, color: '666666' })
              ],
              alignment: AlignmentType.RIGHT
            })
          ]
        })
      },
      footers: {
        default: new Footer({
          children: [
            new Paragraph({
              children: [new TextRun({ text: 'Confidential - For Internal Use Only', size: 20, color: '666666' })],
              alignment: AlignmentType.CENTER
            })
          ]
        })
      },
      children: [
        // Title
        new Paragraph({
          text: `Security Surveillance ${reportType.toUpperCase()} Report`,
          heading: HeadingLevel.HEADING_1
        }),
        new Paragraph({
          children: [
            new TextRun({ text: `Report Period: ${data[0]?.date} to ${data[data.length - 1]?.date}`, size: 24, italics: true })
          ],
          alignment: AlignmentType.CENTER,
          spacing: { after: 300 }
        }),
        // Executive Summary
        new Paragraph({
          text: 'Executive Summary',
          heading: HeadingLevel.HEADING_2
        }),
        new Paragraph({
          children: [
            new TextRun({ text: 'Total Incidents: ', bold: true }),
            new TextRun({ text: `${data.reduce((sum, d) => sum + d.incidents, 0)}` })
          ]
        }),
        new Paragraph({
          children: [
            new TextRun({ text: 'Weapon Detections: ', bold: true }),
            new TextRun({ text: `${data.reduce((sum, d) => sum + d.weaponDetections, 0)}` })
          ]
        }),
        new Paragraph({
          children: [
            new TextRun({ text: 'Behavior Anomalies: ', bold: true }),
            new TextRun({ text: `${data.reduce((sum, d) => sum + d.behaviorAnomalies, 0)}` })
          ]
        }),
        new Paragraph({
          children: [
            new TextRun({ text: 'Suspicious Faces: ', bold: true }),
            new TextRun({ text: `${data.reduce((sum, d) => sum + d.suspiciousFaces, 0)}` })
          ]
        }),
        // AI Analysis
        new Paragraph({
          text: 'AI Analysis & Recommendations',
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 300 }
        }),
        ...analysis.split('\n').filter(line => line.trim()).map(line => new Paragraph({
          children: [new TextRun({ text: line, size: 24 })],
          spacing: { after: 150 }
        })),
        // Chart Placeholder
        new Paragraph({
          text: '[Chart Placeholder: Bar Chart of Incidents by Area]',
          alignment: AlignmentType.CENTER,
          spacing: { before: 300, after: 100 },
          children: [new TextRun({ text: 'Insert bar chart showing incidents, weapon detections, and anomalies by area', color: '666666', italics: true })]
        }),
        // Detailed Data Table
        new Paragraph({
          text: 'Detailed Security Data',
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 300 }
        }),
        new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          rows: [
            new TableRow({
              children: [
                new TableCell({ children: [new Paragraph({ text: 'Date', bold: true })], width: { size: 12, type: WidthType.PERCENTAGE }, borders: { top: { style: BorderStyle.SINGLE }, bottom: { style: BorderStyle.SINGLE }, left: { style: BorderStyle.SINGLE }, right: { style: BorderStyle.SINGLE } } }),
                new TableCell({ children: [new Paragraph({ text: 'Area', bold: true })], width: { size: 20, type: WidthType.PERCENTAGE }, borders: { top: { style: BorderStyle.SINGLE }, bottom: { style: BorderStyle.SINGLE }, left: { style: BorderStyle.SINGLE }, right: { style: BorderStyle.SINGLE } } }),
                new TableCell({ children: [new Paragraph({ text: 'Incidents', bold: true })], width: { size: 12, type: WidthType.PERCENTAGE }, borders: { top: { style: BorderStyle.SINGLE }, bottom: { style: BorderStyle.SINGLE }, left: { style: BorderStyle.SINGLE }, right: { style: BorderStyle.SINGLE } } }),
                new TableCell({ children: [new Paragraph({ text: 'Weapons', bold: true })], width: { size: 18, type: WidthType.PERCENTAGE }, borders: { top: { style: BorderStyle.SINGLE }, bottom: { style: BorderStyle.SINGLE }, left: { style: BorderStyle.SINGLE }, right: { style: BorderStyle.SINGLE } } }),
                new TableCell({ children: [new Paragraph({ text: 'Anomalies', bold: true })], width: { size: 18, type: WidthType.PERCENTAGE }, borders: { top: { style: BorderStyle.SINGLE }, bottom: { style: BorderStyle.SINGLE }, left: { style: BorderStyle.SINGLE }, right: { style: BorderStyle.SINGLE } } }),
                new TableCell({ children: [new Paragraph({ text: 'Susp. Faces', bold: true })], width: { size: 16, type: WidthType.PERCENTAGE }, borders: { top: { style: BorderStyle.SINGLE }, bottom: { style: BorderStyle.SINGLE }, left: { style: BorderStyle.SINGLE }, right: { style: BorderStyle.SINGLE } } }),
                new TableCell({ children: [new Paragraph({ text: 'Risk Level', bold: true })], width: { size: 12, type: WidthType.PERCENTAGE }, borders: { top: { style: BorderStyle.SINGLE }, bottom: { style: BorderStyle.SINGLE }, left: { style: BorderStyle.SINGLE }, right: { style: BorderStyle.SINGLE } } }),
                new TableCell({ children: [new Paragraph({ text: 'Alerts', bold: true })], width: { size: 12, type: WidthType.PERCENTAGE }, borders: { top: { style: BorderStyle.SINGLE }, bottom: { style: BorderStyle.SINGLE }, left: { style: BorderStyle.SINGLE }, right: { style: BorderStyle.SINGLE } } })
              ]
            }),
            ...data.map(item => new TableRow({
              children: [
                new TableCell({ children: [new Paragraph({ text: item.date })], borders: { top: { style: BorderStyle.SINGLE }, bottom: { style: BorderStyle.SINGLE }, left: { style: BorderStyle.SINGLE }, right: { style: BorderStyle.SINGLE } } }),
                new TableCell({ children: [new Paragraph({ text: item.area })], borders: { top: { style: BorderStyle.SINGLE }, bottom: { style: BorderStyle.SINGLE }, left: { style: BorderStyle.SINGLE }, right: { style: BorderStyle.SINGLE } } }),
                new TableCell({ children: [new Paragraph({ text: item.incidents.toString() })], borders: { top: { style: BorderStyle.SINGLE }, bottom: { style: BorderStyle.SINGLE }, left: { style: BorderStyle.SINGLE }, right: { style: BorderStyle.SINGLE } } }),
                new TableCell({ children: [new Paragraph({ text: item.weaponDetections.toString() })], borders: { top: { style: BorderStyle.SINGLE }, bottom: { style: BorderStyle.SINGLE }, left: { style: BorderStyle.SINGLE }, right: { style: BorderStyle.SINGLE } } }),
                new TableCell({ children: [new Paragraph({ text: item.behaviorAnomalies.toString() })], borders: { top: { style: BorderStyle.SINGLE }, bottom: { style: BorderStyle.SINGLE }, left: { style: BorderStyle.SINGLE }, right: { style: BorderStyle.SINGLE } } }),
                new TableCell({ children: [new Paragraph({ text: item.suspiciousFaces.toString() })], borders: { top: { style: BorderStyle.SINGLE }, bottom: { style: BorderStyle.SINGLE }, left: { style: BorderStyle.SINGLE }, right: { style: BorderStyle.SINGLE } } }),
                new TableCell({ 
                  children: [new Paragraph({ 
                    text: item.riskLevel,
                    run: { 
                      color: item.riskLevel === 'Critical' ? 'FF0000' : item.riskLevel === 'High' ? 'FFA500' : item.riskLevel === 'Medium' ? 'FFFF00' : '008000'
                    }
                  })], 
                  borders: { top: { style: BorderStyle.SINGLE }, bottom: { style: BorderStyle.SINGLE }, left: { style: BorderStyle.SINGLE }, right: { style: BorderStyle.SINGLE } }
                }),
                new TableCell({ children: [new Paragraph({ text: item.alertsTriggered.toString() })], borders: { top: { style: BorderStyle.SINGLE }, bottom: { style: BorderStyle.SINGLE }, left: { style: BorderStyle.SINGLE }, right: { style: BorderStyle.SINGLE } } })
              ]
            }))
          ]
        }),
        // Area Summary Table
        new Paragraph({
          text: 'Area-wise Security Summary',
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 300 }
        }),
        new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          rows: [
            new TableRow({
              children: [
                new TableCell({ children: [new Paragraph({ text: 'Area', bold: true })], width: { size: 25, type: WidthType.PERCENTAGE }, borders: { top: { style: BorderStyle.SINGLE }, bottom: { style: BorderStyle.SINGLE }, left: { style: BorderStyle.SINGLE }, right: { style: BorderStyle.SINGLE } } }),
                new TableCell({ children: [new Paragraph({ text: 'Incidents', bold: true })], width: { size: 25, type: WidthType.PERCENTAGE }, borders: { top: { style: BorderStyle.SINGLE }, bottom: { style: BorderStyle.SINGLE }, left: { style: BorderStyle.SINGLE }, right: { style: BorderStyle.SINGLE } } }),
                new TableCell({ children: [new Paragraph({ text: 'Weapons', bold: true })], width: { size: 25, type: WidthType.PERCENTAGE }, borders: { top: { style: BorderStyle.SINGLE }, bottom: { style: BorderStyle.SINGLE }, left: { style: BorderStyle.SINGLE }, right: { style: BorderStyle.SINGLE } } }),
                new TableCell({ children: [new Paragraph({ text: 'Anomalies', bold: true })], width: { size: 25, type: WidthType.PERCENTAGE }, borders: { top: { style: BorderStyle.SINGLE }, bottom: { style: BorderStyle.SINGLE }, left: { style: BorderStyle.SINGLE }, right: { style: BorderStyle.SINGLE } } })
              ]
            }),
            ...Object.entries(data.reduce((acc, item) => {
              if (!acc[item.area]) {
                acc[item.area] = { incidents: 0, weapons: 0, anomalies: 0 };
              }
              acc[item.area].incidents += item.incidents;
              acc[item.area].weapons += item.weaponDetections;
              acc[item.area].anomalies += item.behaviorAnomalies;
              return acc;
            }, {} as Record<string, any>)).map(([area, stats]) => new TableRow({
              children: [
                new TableCell({ children: [new Paragraph({ text: area })], borders: { top: { style: BorderStyle.SINGLE }, bottom: { style: BorderStyle.SINGLE }, left: { style: BorderStyle.SINGLE }, right: { style: BorderStyle.SINGLE } } }),
                new TableCell({ children: [new Paragraph({ text: stats.incidents.toString() })], borders: { top: { style: BorderStyle.SINGLE }, bottom: { style: BorderStyle.SINGLE }, left: { style: BorderStyle.SINGLE }, right: { style: BorderStyle.SINGLE } } }),
                new TableCell({ children: [new Paragraph({ text: stats.weapons.toString() })], borders: { top: { style: BorderStyle.SINGLE }, bottom: { style: BorderStyle.SINGLE }, left: { style: BorderStyle.SINGLE }, right: { style: BorderStyle.SINGLE } } }),
                new TableCell({ children: [new Paragraph({ text: stats.anomalies.toString() })], borders: { top: { style: BorderStyle.SINGLE }, bottom: { style: BorderStyle.SINGLE }, left: { style: BorderStyle.SINGLE }, right: { style: BorderStyle.SINGLE } } })
              ]
            }))
          ]
        }),
        // Additional Chart Placeholder
        new Paragraph({
          text: '[Chart Placeholder: Trend Analysis]',
          alignment: AlignmentType.CENTER,
          spacing: { before: 300, after: 100 },
          children: [new TextRun({ text: 'Insert line chart showing incident trends over time', color: '666666', italics: true })]
        })
      ]
    }]
  });

  return Buffer.from(await Packer.toBuffer(doc));
}

export async function POST(request: NextRequest) {
  try {
    const { reportType, startDate, endDate, areas }: ReportRequest = await request.json();
    
    if (!reportType || !startDate || !endDate) {
      return NextResponse.json(
        { error: 'Report type, start date, and end date are required', success: false },
        { status: 400 }
      );
    }
    
    // Generate or fetch security data
    const securityData = generateMockSecurityData(reportType, startDate, endDate);
    
    // Generate AI analysis
    const analysis = await generateAIAnalysis(securityData, reportType);
    
    // Create Word report
    const wordBuffer = await createWordReport(securityData, analysis, reportType);
    
    // Convert buffer to base64 for JSON response
    const base64Word = wordBuffer.toString('base64');
    
    return NextResponse.json({
      success: true,
      reportData: {
        fileName: `security_report_${reportType}_${new Date().toISOString().split('T')[0]}.docx`,
        fileData: base64Word,
        summary: {
          totalIncidents: securityData.reduce((sum, d) => sum + d.incidents, 0),
          totalWeaponDetections: securityData.reduce((sum, d) => sum + d.weaponDetections, 0),
          totalBehaviorAnomalies: securityData.reduce((sum, d) => sum + d.behaviorAnomalies, 0),
          totalSuspiciousFaces: securityData.reduce((sum, d) => sum + d.suspiciousFaces, 0),
          highRiskAreas: [...new Set(securityData.filter(d => d.riskLevel === 'High' || d.riskLevel === 'Critical').map(d => d.area))]
        },
        analysis: analysis
      }
    });
    
  } catch (error) {
    console.error('Error generating report:', error);
    return NextResponse.json(
      {
        error: 'Failed to generate report',
        success: false
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  );
}