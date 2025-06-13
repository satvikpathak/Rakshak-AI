// src/app/api/reports/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import ExcelJS from 'exceljs';
import path from 'path';
import fs from 'fs';

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

// Mock data generator - replace with your actual database queries
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
  
  const dataeSummary = {
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
  - Total Incidents: ${dataeSummary.totalIncidents}
  - Total Weapon Detections: ${dataeSummary.totalWeaponDetections}
  - Total Behavior Anomalies: ${dataeSummary.totalBehaviorAnomalies}
  - Total Suspicious Faces: ${dataeSummary.totalSuspiciousFaces}
  - Average Alerts Per Day: ${dataeSummary.averageAlertsPerDay.toFixed(2)}
  - High Risk Areas: ${dataeSummary.highRiskAreas.join(', ')}
  
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

async function createExcelReport(data: SecurityData[], analysis: string, reportType: string): Promise<Buffer> {
  const workbook = new ExcelJS.Workbook();
  
  // Summary Sheet
  const summarySheet = workbook.addWorksheet('Executive Summary');
  summarySheet.getColumn('A').width = 30;
  summarySheet.getColumn('B').width = 20;
  
  // Title
  summarySheet.mergeCells('A1:B1');
  const titleCell = summarySheet.getCell('A1');
  titleCell.value = `Security Surveillance ${reportType.toUpperCase()} Report`;
  titleCell.font = { bold: true, size: 16 };
  titleCell.alignment = { horizontal: 'center' };
  
  // Date range
  summarySheet.getCell('A3').value = 'Report Period:';
  summarySheet.getCell('B3').value = `${data[0]?.date} to ${data[data.length - 1]?.date}`;
  
  // Key metrics
  const totalIncidents = data.reduce((sum, d) => sum + d.incidents, 0);
  const totalWeapons = data.reduce((sum, d) => sum + d.weaponDetections, 0);
  const totalAnomalies = data.reduce((sum, d) => sum + d.behaviorAnomalies, 0);
  const totalSuspicious = data.reduce((sum, d) => sum + d.suspiciousFaces, 0);
  
  summarySheet.getCell('A5').value = 'Key Metrics:';
  summarySheet.getCell('A6').value = 'Total Incidents:';
  summarySheet.getCell('B6').value = totalIncidents;
  summarySheet.getCell('A7').value = 'Weapon Detections:';
  summarySheet.getCell('B7').value = totalWeapons;
  summarySheet.getCell('A8').value = 'Behavior Anomalies:';
  summarySheet.getCell('B8').value = totalAnomalies;
  summarySheet.getCell('A9').value = 'Suspicious Faces:';
  summarySheet.getCell('B9').value = totalSuspicious;
  
  // AI Analysis
  summarySheet.getCell('A11').value = 'AI Analysis & Recommendations:';
  summarySheet.getCell('A11').font = { bold: true };
  
  const analysisLines = analysis.split('\n');
  let currentRow = 12;
  analysisLines.forEach(line => {
    if (line.trim()) {
      summarySheet.getCell(`A${currentRow}`).value = line;
      summarySheet.mergeCells(`A${currentRow}:B${currentRow}`);
      summarySheet.getCell(`A${currentRow}`).alignment = { wrapText: true };
      currentRow++;
    }
  });
  
  // Raw Data Sheet
  const dataSheet = workbook.addWorksheet('Detailed Data');
  dataSheet.columns = [
    { header: 'Date', key: 'date', width: 12 },
    { header: 'Area', key: 'area', width: 20 },
    { header: 'Incidents', key: 'incidents', width: 12 },
    { header: 'Weapon Detections', key: 'weaponDetections', width: 18 },
    { header: 'Behavior Anomalies', key: 'behaviorAnomalies', width: 18 },
    { header: 'Suspicious Faces', key: 'suspiciousFaces', width: 16 },
    { header: 'Risk Level', key: 'riskLevel', width: 12 },
    { header: 'Total Alerts', key: 'alertsTriggered', width: 12 }
  ];
  
  // Add data
  dataSheet.addRows(data);
  
  // Style the header
  const headerRow = dataSheet.getRow(1);
  headerRow.font = { bold: true };
  headerRow.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FF4472C4' }
  };
  
  // Add conditional formatting for risk levels
  dataSheet.addConditionalFormatting({
    ref: `G2:G${data.length + 1}`,
    rules: [
      {
        type: 'containsText',
        operator: 'containsText',
        text: 'Critical',
        style: {
          fill: { type: 'pattern', pattern: 'solid', bgColor: { argb: 'FFFF0000' } },
          font: { color: { argb: 'FFFFFFFF' } }
        }
      },
      {
        type: 'containsText',
        operator: 'containsText',
        text: 'High',
        style: {
          fill: { type: 'pattern', pattern: 'solid', bgColor: { argb: 'FFFF8C00' } }
        }
      },
      {
        type: 'containsText',
        operator: 'containsText',
        text: 'Medium',
        style: {
          fill: { type: 'pattern', pattern: 'solid', bgColor: { argb: 'FFFFFF00' } }
        }
      }
    ]
  });
  
  // Charts Sheet
  const chartsSheet = workbook.addWorksheet('Analytics');
  
  // Area-wise incident summary
  const areaStats = data.reduce((acc, item) => {
    if (!acc[item.area]) {
      acc[item.area] = {
        incidents: 0,
        weapons: 0,
        anomalies: 0,
        suspicious: 0
      };
    }
    acc[item.area].incidents += item.incidents;
    acc[item.area].weapons += item.weaponDetections;
    acc[item.area].anomalies += item.behaviorAnomalies;
    acc[item.area].suspicious += item.suspiciousFaces;
    return acc;
  }, {} as Record<string, any>);
  
  // Add area summary table
  chartsSheet.getCell('A1').value = 'Area-wise Security Summary';
  chartsSheet.getCell('A1').font = { bold: true, size: 14 };
  
  chartsSheet.getCell('A3').value = 'Area';
  chartsSheet.getCell('B3').value = 'Total Incidents';
  chartsSheet.getCell('C3').value = 'Weapon Detections';
  chartsSheet.getCell('D3').value = 'Behavior Anomalies';
  chartsSheet.getCell('E3').value = 'Suspicious Faces';
  
  let row = 4;
  Object.entries(areaStats).forEach(([area, stats]) => {
    chartsSheet.getCell(`A${row}`).value = area;
    chartsSheet.getCell(`B${row}`).value = stats.incidents;
    chartsSheet.getCell(`C${row}`).value = stats.weapons;
    chartsSheet.getCell(`D${row}`).value = stats.anomalies;
    chartsSheet.getCell(`E${row}`).value = stats.suspicious;
    row++;
  });
  
  // Style the analytics header
  const analyticsHeaderRow = chartsSheet.getRow(3);
  analyticsHeaderRow.font = { bold: true };
  analyticsHeaderRow.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FF70AD47' }
  };
  
  return await workbook.xlsx.writeBuffer() as Buffer;
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
    
    // Create Excel report
    const excelBuffer = await createExcelReport(securityData, analysis, reportType);
    
    // Convert buffer to base64 for JSON response
    const base64Excel = excelBuffer.toString('base64');
    
    return NextResponse.json({
      success: true,
      reportData: {
        fileName: `security_report_${reportType}_${new Date().toISOString().split('T')[0]}.xlsx`,
        fileData: base64Excel,
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