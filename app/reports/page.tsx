"use client"
import React, { useState } from 'react';
import { Download, FileText, Calendar, BarChart3, PieChart, AlertTriangle, Shield, Eye, Target } from 'lucide-react';

interface ReportSummary {
  totalIncidents: number;
  totalWeaponDetections: number;
  totalBehaviorAnomalies: number;
  totalSuspiciousFaces: number;
  highRiskAreas: string[];
}

interface ReportData {
  fileName: string;
  fileData: string;
  summary: ReportSummary;
  analysis: string;
}

const SecurityReportGenerator: React.FC = () => {
  const [reportType, setReportType] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateReport = async () => {
    setIsGenerating(true);
    setError(null);
    
    try {
      // Validate dates
      if (new Date(startDate) > new Date(endDate)) {
        throw new Error('Start date cannot be after end date');
      }

      const response = await fetch('/api/reports', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          reportType,
          startDate,
          endDate
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        setReportData(data.reportData);
        setShowAnalysis(false);
      } else {
        setError(data.error || 'Failed to generate report');
      }
    } catch (error) {
      console.error('Error generating report:', error);
      setError(error instanceof Error ? error.message : 'Failed to generate report. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadReport = () => {
    if (!reportData) return;
    
    try {
      const binaryString = atob(reportData.fileData);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      
      const blob = new Blob([bytes], { 
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
      });
      
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = reportData.fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading report:', error);
      setError('Failed to download report');
    }
  };

  const clearReport = () => {
    setReportData(null);
    setShowAnalysis(false);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 mb-8 border border-white/20">
          <div className="flex items-center space-x-4">
            <div className="bg-blue-600 p-3 rounded-lg">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Security Analytics Dashboard</h1>
              <p className="text-blue-200">AI-Powered Security Report Generation</p>
            </div>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-500/20 backdrop-blur-md rounded-xl p-4 mb-6 border border-red-300/20">
            <div className="flex items-center">
              <AlertTriangle className="w-5 h-5 text-red-400 mr-2" />
              <span className="text-red-200">{error}</span>
              <button
                onClick={() => setError(null)}
                className="ml-auto text-red-300 hover:text-red-100"
              >
                ×
              </button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Report Configuration */}
          <div className="lg:col-span-1">
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
              <h2 className="text-xl font-bold text-white mb-6 flex items-center">
                <Calendar className="w-5 h-5 mr-2" />
                Generate Report
              </h2>
              
              {/* Report Type Selection */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-blue-200 mb-3">
                  Report Type
                </label>
                <div className="space-y-2">
                  {(['daily', 'weekly', 'monthly'] as const).map((type) => (
                    <label key={type} className="flex items-center">
                      <input
                        type="radio"
                        name="reportType"
                        value={type}
                        checked={reportType === type}
                        onChange={(e) => setReportType(e.target.value as 'daily' | 'weekly' | 'monthly')}
                        className="mr-3 text-blue-600"
                        disabled={isGenerating}
                      />
                      <span className="text-white capitalize">{type} Report</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Date Range */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-blue-200 mb-2">
                  Start Date
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  disabled={isGenerating}
                  className="w-full p-3 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:border-blue-400 disabled:opacity-50"
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-blue-200 mb-2">
                  End Date
                </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  disabled={isGenerating}
                  className="w-full p-3 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:border-blue-400 disabled:opacity-50"
                />
              </div>

              {/* Generate Button */}
              <button
                onClick={generateReport}
                disabled={isGenerating}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-3 px-6 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center mb-4"
              >
                {isGenerating ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Generating...
                  </>
                ) : (
                  <>
                    <BarChart3 className="w-5 h-5 mr-2" />
                    Generate Report
                  </>
                )}
              </button>

              {/* Clear Report Button */}
              {reportData && (
                <button
                  onClick={clearReport}
                  className="w-full bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                >
                  Clear Report
                </button>
              )}

              {/* Feature Highlights */}
              <div className="mt-8 space-y-3">
                <h3 className="text-lg font-semibold text-white mb-4">Report Features</h3>
                <div className="flex items-center text-blue-200">
                  <PieChart className="w-4 h-4 mr-2" />
                  <span className="text-sm">Interactive Charts & Graphs</span>
                </div>
                <div className="flex items-center text-blue-200">
                  <Target className="w-4 h-4 mr-2" />
                  <span className="text-sm">AI-Powered Risk Analysis</span>
                </div>
                <div className="flex items-center text-blue-200">
                  <Eye className="w-4 h-4 mr-2" />
                  <span className="text-sm">Behavioral Pattern Detection</span>
                </div>
                <div className="flex items-center text-blue-200">
                  <AlertTriangle className="w-4 h-4 mr-2" />
                  <span className="text-sm">Threat Assessment Summary</span>
                </div>
              </div>
            </div>
          </div>

          {/* Report Results */}
          <div className="lg:col-span-2">
            {reportData ? (
              <div className="space-y-6">
                {/* Summary Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-gradient-to-br from-red-500/20 to-red-600/20 backdrop-blur-md rounded-xl p-4 border border-red-300/20">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-red-200 text-sm">Total Incidents</p>
                        <p className="text-2xl font-bold text-white">{reportData.summary.totalIncidents}</p>
                      </div>
                      <AlertTriangle className="w-8 h-8 text-red-400" />
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-orange-500/20 to-orange-600/20 backdrop-blur-md rounded-xl p-4 border border-orange-300/20">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-orange-200 text-sm">Weapon Detections</p>
                        <p className="text-2xl font-bold text-white">{reportData.summary.totalWeaponDetections}</p>
                      </div>
                      <Target className="w-8 h-8 text-orange-400" />
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-yellow-500/20 to-yellow-600/20 backdrop-blur-md rounded-xl p-4 border border-yellow-300/20">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-yellow-200 text-sm">Behavior Anomalies</p>
                        <p className="text-2xl font-bold text-white">{reportData.summary.totalBehaviorAnomalies}</p>
                      </div>
                      <Eye className="w-8 h-8 text-yellow-400" />
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 backdrop-blur-md rounded-xl p-4 border border-purple-300/20">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-purple-200 text-sm">Suspicious Faces</p>
                        <p className="text-2xl font-bold text-white">{reportData.summary.totalSuspiciousFaces}</p>
                      </div>
                      <Shield className="w-8 h-8 text-purple-400" />
                    </div>
                  </div>
                </div>

                {/* High Risk Areas */}
                <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                    <AlertTriangle className="w-5 h-5 mr-2 text-red-400" />
                    High Risk Areas Identified
                  </h3>
                  {reportData.summary.highRiskAreas.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {reportData.summary.highRiskAreas.map((area, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium"
                        >
                          {area}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-green-400">No high-risk areas detected in this period.</p>
                  )}
                </div>

                {/* AI Analysis */}
                <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-white flex items-center">
                      <BarChart3 className="w-5 h-5 mr-2 text-blue-400" />
                      AI Security Analysis
                    </h3>
                    <button
                      onClick={() => setShowAnalysis(!showAnalysis)}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm transition-colors"
                    >
                      {showAnalysis ? 'Hide' : 'Show'} Analysis
                    </button>
                  </div>
                  
                  {showAnalysis && (
                    <div className="bg-black/20 rounded-lg p-4 border border-white/10">
                      <div className="text-blue-100 text-sm whitespace-pre-wrap">
                        {reportData.analysis}
                      </div>
                    </div>
                  )}
                </div>

                {/* Download Section */}
                <div className="bg-gradient-to-r from-green-500/20 to-blue-500/20 backdrop-blur-md rounded-xl p-6 border border-white/20">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-white mb-2">Download Complete Report</h3>
                      <p className="text-blue-200 text-sm">
                        Docx file with detailed analytics, charts, and recommendations
                      </p>
                      <p className="text-blue-300 text-xs mt-1">
                        File: {reportData.fileName}
                      </p>
                    </div>
                    <button
                      onClick={downloadReport}
                      className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-all duration-200 flex items-center"
                    >
                      <Download className="w-5 h-5 mr-2" />
                      Download Docx
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-12 border border-white/20 text-center">
                <FileText className="w-16 h-16 text-blue-400 mx-auto mb-6" />
                <h3 className="text-xl font-bold text-white mb-4">Ready to Generate Report</h3>
                <p className="text-blue-200 mb-6">
                  Select your report type and date range, then click "Generate Report" to create your security analysis.
                </p>
                <div className="bg-black/20 rounded-lg p-4 border border-white/10">
                  <h4 className="text-white font-medium mb-2">What you'll get:</h4>
                  <ul className="text-blue-200 text-sm space-y-1">
                    <li>• Comprehensive incident analysis</li>
                    <li>• AI-powered threat assessment</li>
                    <li>• Risk area identification</li>
                    <li>• Detailed Excel report with charts</li>
                    <li>• Actionable security recommendations</li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecurityReportGenerator;