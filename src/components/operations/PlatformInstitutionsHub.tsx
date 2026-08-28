import React, { useState, useMemo } from 'react';
import ReactECharts from 'echarts-for-react';
import {
  OrgTreeNode,
  mockPlatformOrgTreeData,
} from './monitoringData';

interface PlatformInstitutionsHubProps {
  onSelectInstitution: (institution: OrgTreeNode) => void;
}

export const PlatformInstitutionsHub: React.FC<PlatformInstitutionsHubProps> = ({
  onSelectInstitution,
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedIndustry, setSelectedIndustry] = useState<string>('ALL');
  const [selectedStatusType, setSelectedStatusType] = useState<string>('ALL');
  const [selectedHealth, setSelectedHealth] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<'todayReports' | 'personnel' | 'pending' | 'quota' | 'default'>('todayReports');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 500);
  };

  // Compute Platform-wide Aggregate Statistics
  const platformStats = useMemo(() => {
    let totalInstitutions = mockPlatformOrgTreeData.length;
    let officialCount = mockPlatformOrgTreeData.filter((i) => i.statusType === '正式').length;
    let trialCount = mockPlatformOrgTreeData.filter((i) => i.statusType === '试用').length;

    let totalSubBranches = 0;
    let totalPersonnel = 0;
    let activePersonnel = 0;
    let totalQrLimit = 0;
    let totalQrUsed = 0;
    let totalTodayReports = 0;
    let totalPendingReview = 0;
    let totalReviewedToday = 0;

    const countNodes = (nodes: OrgTreeNode[], isTop = true) => {
      for (const n of nodes) {
        if (!isTop) totalSubBranches++;
        totalPersonnel += n.totalPersonnel;
        activePersonnel += n.activePersonnel;
        totalQrLimit += n.qrLimit;
        totalQrUsed += n.qrUsed;
        totalTodayReports += n.todayReports;
        totalPendingReview += n.pendingReview;
        totalReviewedToday += n.reviewedToday;
        if (n.children && n.children.length > 0) {
          countNodes(n.children, false);
        }
      }
    };

    countNodes(mockPlatformOrgTreeData, true);

    const avgPassRate = 96.4;
    const avgReviewSpeed = 11.6;

    return {
      totalInstitutions,
      officialCount,
      trialCount,
      totalSubBranches: totalSubBranches + 134, // includes leaf grid stations
      totalPersonnel,
      activePersonnel,
      totalQrLimit,
      totalQrUsed,
      totalTodayReports,
      totalPendingReview,
      totalReviewedToday,
      avgPassRate,
      avgReviewSpeed,
    };
  }, []);

  // Distinct industries
  const industries = useMemo(() => {
    const set = new Set<string>();
    mockPlatformOrgTreeData.forEach((i) => set.add(i.industry));
    return Array.from(set);
  }, []);

  // Filtered & Sorted Institutions
  const filteredInstitutions = useMemo(() => {
    return mockPlatformOrgTreeData
      .filter((inst) => {
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchName = inst.name.toLowerCase().includes(q);
          const matchCode = inst.code.toLowerCase().includes(q);
          const matchLeader = inst.leader.toLowerCase().includes(q);
          const matchRegion = inst.region.toLowerCase().includes(q);
          if (!matchName && !matchCode && !matchLeader && !matchRegion) {
            return false;
          }
        }
        if (selectedIndustry !== 'ALL' && inst.industry !== selectedIndustry) {
          return false;
        }
        if (selectedStatusType !== 'ALL' && inst.statusType !== selectedStatusType) {
          return false;
        }
        if (selectedHealth !== 'ALL' && inst.healthStatus !== selectedHealth) {
          return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'todayReports') return b.todayReports - a.todayReports;
        if (sortBy === 'personnel') return b.totalPersonnel - a.totalPersonnel;
        if (sortBy === 'pending') return b.pendingReview - a.pendingReview;
        if (sortBy === 'quota') return b.qrUsed / b.qrLimit - a.qrUsed / a.qrLimit;
        return 0;
      });
  }, [searchQuery, selectedIndustry, selectedStatusType, selectedHealth, sortBy]);

  // ECharts Option: Top Institutions Activity & Review Volume
  const topInstitutionsChartOption = useMemo(() => {
    const top6 = [...mockPlatformOrgTreeData]
      .sort((a, b) => b.todayReports - a.todayReports)
      .slice(0, 6);

    return {
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'shadow' },
        backgroundColor: 'rgba(255, 255, 255, 0.98)',
        borderColor: '#e2e8f0',
        textStyle: { color: '#1e293b', fontSize: 12 },
      },
      legend: {
        data: ['今日上报量', '今日审核办结', '待审核堆积'],
        right: '2%',
        top: '2%',
        icon: 'roundRect',
        textStyle: { color: '#64748b', fontSize: 11 },
      },
      grid: {
        left: '2%',
        right: '3%',
        top: '16%',
        bottom: '6%',
        containLabel: true,
      },
      xAxis: {
        type: 'category',
        data: top6.map((i) => (i.name.length > 8 ? i.name.slice(0, 8) + '...' : i.name)),
        axisLine: { lineStyle: { color: '#cbd5e1' } },
        axisLabel: { color: '#475569', fontSize: 11, interval: 0 },
      },
      yAxis: {
        type: 'value',
        name: '数量 (件)',
        nameTextStyle: { color: '#94a3b8', fontSize: 10 },
        splitLine: { lineStyle: { type: 'dashed', color: '#f1f5f9' } },
        axisLabel: { color: '#64748b', fontSize: 11 },
      },
      series: [
        {
          name: '今日上报量',
          type: 'bar',
          barWidth: 14,
          data: top6.map((i) => i.todayReports),
          itemStyle: { color: '#3b82f6', borderRadius: [4, 4, 0, 0] },
        },
        {
          name: '今日审核办结',
          type: 'bar',
          barWidth: 14,
          data: top6.map((i) => i.reviewedToday),
          itemStyle: { color: '#10b981', borderRadius: [4, 4, 0, 0] },
        },
        {
          name: '待审核堆积',
          type: 'bar',
          barWidth: 14,
          data: top6.map((i) => i.pendingReview),
          itemStyle: { color: '#f59e0b', borderRadius: [4, 4, 0, 0] },
        },
      ],
    };
  }, []);

  // ECharts Option: Industry Distribution
  const industryDistributionChartOption = useMemo(() => {
    const industryCounts: Record<string, number> = {};
    mockPlatformOrgTreeData.forEach((i) => {
      industryCounts[i.industry] = (industryCounts[i.industry] || 0) + i.todayReports;
    });

    const data = Object.entries(industryCounts).map(([name, value]) => ({
      name,
      value,
    }));

    return {
      tooltip: {
        trigger: 'item',
        formatter: '{b}: {c} 件 ({d}%)',
        backgroundColor: 'rgba(255, 255, 255, 0.98)',
        borderColor: '#e2e8f0',
        textStyle: { color: '#1e293b', fontSize: 12 },
      },
      legend: {
        orient: 'vertical',
        right: '2%',
        top: 'center',
        icon: 'circle',
        itemWidth: 8,
        itemHeight: 8,
        textStyle: { color: '#64748b', fontSize: 11 },
      },
      series: [
        {
          name: '行业上报分布',
          type: 'pie',
          radius: ['45%', '72%'],
          center: ['40%', '50%'],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 6,
            borderColor: '#fff',
            borderWidth: 2,
          },
          label: { show: false },
          emphasis: {
            label: {
              show: true,
              fontSize: 12,
              fontWeight: 'bold',
              formatter: '{b}\n{d}%',
            },
          },
          data,
        },
      ],
    };
  }, []);

  return (
    <div className="space-y-6 pb-12">
      {/* ========================================== */}
      {/* Header Banner: Title & Global Actions */}
      {/* ========================================== */}
      <div className="bg-white rounded-2xl border border-gray-200/90 p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse" />
                全网运行总枢纽
              </span>
              <span className="text-xs text-gray-400">· 实时数据监控</span>
            </div>
            <h1 className="text-xl font-bold text-gray-900 tracking-tight">
              全平台机构运营监控中心
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 max-w-3xl">
              汇聚全网 18 家纳管机构与 142 个下属二级分中心/基层网格速报站。请在下方选择任意机构，点击
              <span className="font-semibold text-blue-600">「进入机构监控中心」</span>
              下钻查看该机构专属的组织树拓扑、人员效能与审核流转看板。
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0 self-start md:self-auto">
            <button
              id="refresh_platform_ops_btn"
              onClick={handleRefresh}
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-700 rounded-xl text-xs font-medium transition-all shadow-2xs active:scale-95 cursor-pointer"
            >
              <svg
                className={`w-3.5 h-3.5 text-gray-500 ${isRefreshing ? 'animate-spin' : ''}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              <span>{isRefreshing ? '刷新中...' : '刷新数据'}</span>
            </button>
          </div>
        </div>

        {/* Global Key Metrics 6 Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-5 mt-5 border-t border-gray-100">
          <div className="p-3 bg-blue-50/50 rounded-xl border border-blue-100/60">
            <div className="text-[11px] font-medium text-blue-800">全平台纳管机构</div>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-xl font-bold font-mono text-blue-900">
                {platformStats.totalInstitutions}
              </span>
              <span className="text-[10px] text-blue-700">家</span>
            </div>
            <div className="text-[10px] text-blue-600/80 mt-0.5">
              正式 {platformStats.officialCount} · 试用 {platformStats.trialCount}
            </div>
          </div>

          <div className="p-3 bg-indigo-50/50 rounded-xl border border-indigo-100/60">
            <div className="text-[11px] font-medium text-indigo-800">子级分支与网格站</div>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-xl font-bold font-mono text-indigo-900">
                {platformStats.totalSubBranches}
              </span>
              <span className="text-[10px] text-indigo-700">个</span>
            </div>
            <div className="text-[10px] text-indigo-600/80 mt-0.5">覆盖 18+ 市县与高校</div>
          </div>

          <div className="p-3 bg-violet-50/50 rounded-xl border border-violet-100/60">
            <div className="text-[11px] font-medium text-violet-800">在岗采编/审核人员</div>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-xl font-bold font-mono text-violet-900">
                {platformStats.totalPersonnel.toLocaleString()}
              </span>
              <span className="text-[10px] text-violet-700">人</span>
            </div>
            <div className="text-[10px] text-violet-600/80 mt-0.5">
              今日活跃 {platformStats.activePersonnel.toLocaleString()} 人
            </div>
          </div>

          <div className="p-3 bg-emerald-50/50 rounded-xl border border-emerald-100/60">
            <div className="text-[11px] font-medium text-emerald-800">今日上报事件总量</div>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-xl font-bold font-mono text-emerald-900">
                {platformStats.totalTodayReports.toLocaleString()}
              </span>
              <span className="text-[10px] text-emerald-700">件</span>
            </div>
            <div className="text-[10px] text-emerald-600/80 mt-0.5">
              办结 {platformStats.totalReviewedToday.toLocaleString()} 件
            </div>
          </div>

          <div className="p-3 bg-amber-50/50 rounded-xl border border-amber-100/60">
            <div className="text-[11px] font-medium text-amber-800">待审核/流转中工单</div>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-xl font-bold font-mono text-amber-900">
                {platformStats.totalPendingReview}
              </span>
              <span className="text-[10px] text-amber-700">件</span>
            </div>
            <div className="text-[10px] text-amber-600/80 mt-0.5">初审与终审池流转中</div>
          </div>

          <div className="p-3 bg-cyan-50/50 rounded-xl border border-cyan-100/60">
            <div className="text-[11px] font-medium text-cyan-800">综合平均处理时效</div>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-xl font-bold font-mono text-cyan-900">
                {platformStats.avgReviewSpeed}
              </span>
              <span className="text-[10px] text-cyan-700">分钟</span>
            </div>
            <div className="text-[10px] text-cyan-600/80 mt-0.5">
              通过率 {platformStats.avgPassRate}%
            </div>
          </div>
        </div>
      </div>

      {/* ========================================== */}
      {/* Platform Level Charts: Top 6 & Industries */}
      {/* ========================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-200/90 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-4 bg-blue-600 rounded-full" />
              <h2 className="text-sm font-bold text-gray-900">全网各重点机构运营活跃度对比 TOP 6</h2>
            </div>
            <span className="text-xs text-gray-400">实时上报与审核流转量</span>
          </div>
          <div className="h-[220px]">
            <ReactECharts
              option={topInstitutionsChartOption}
              style={{ height: '100%', width: '100%' }}
              opts={{ renderer: 'svg' }}
            />
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200/90 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-4 bg-indigo-600 rounded-full" />
              <h2 className="text-sm font-bold text-gray-900">行业分类上报占比分布</h2>
            </div>
            <span className="text-xs text-gray-400">各领域工单权重</span>
          </div>
          <div className="h-[220px]">
            <ReactECharts
              option={industryDistributionChartOption}
              style={{ height: '100%', width: '100%' }}
              opts={{ renderer: 'svg' }}
            />
          </div>
        </div>
      </div>

      {/* ========================================== */}
      {/* Search, Filters & View Mode Selector */}
      {/* ========================================== */}
      <div className="bg-white rounded-2xl border border-gray-200/90 p-4 shadow-xs space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <svg
              className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              id="inst_search_input"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="搜索机构名称、机构编码、负责人姓名或地域..."
              className="w-full pl-9.5 pr-4 py-2 bg-gray-50/80 border border-gray-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-gray-800 placeholder-gray-400 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs cursor-pointer"
              >
                ✕
              </button>
            )}
          </div>

          {/* Quick Filters */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Industry Filter */}
            <select
              id="industry_filter_select"
              value={selectedIndustry}
              onChange={(e) => setSelectedIndustry(e.target.value)}
              aria-label="行业属性筛选"
              className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer"
            >
              <option value="ALL">全部行业属性</option>
              {industries.map((ind) => (
                <option key={ind} value={ind}>
                  {ind}
                </option>
              ))}
            </select>

            {/* Status Type Filter */}
            <select
              id="status_type_filter_select"
              value={selectedStatusType}
              onChange={(e) => setSelectedStatusType(e.target.value)}
              aria-label="服务状态筛选"
              className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer"
            >
              <option value="ALL">全部服务状态</option>
              <option value="正式">正式机构</option>
              <option value="试用">试用机构</option>
            </select>

            {/* Health Filter */}
            <select
              id="health_filter_select"
              value={selectedHealth}
              onChange={(e) => setSelectedHealth(e.target.value)}
              aria-label="运行健康状态筛选"
              className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer"
            >
              <option value="ALL">全部健康状态</option>
              <option value="healthy">优良运行</option>
              <option value="busy">高频/待审较多</option>
              <option value="alert">预警关注</option>
            </select>

            {/* Sort Filter */}
            <select
              id="sort_by_select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              aria-label="排序维度"
              className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer"
            >
              <option value="todayReports">按今日上报量降序</option>
              <option value="personnel">按在编人员降序</option>
              <option value="pending">按待审积压降序</option>
              <option value="quota">按二维码占用率降序</option>
            </select>

            {/* View Mode Toggle */}
            <div className="flex items-center bg-gray-100 p-0.5 rounded-xl border border-gray-200/80">
              <button
                id="view_mode_grid_btn"
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                  viewMode === 'grid'
                    ? 'bg-white text-blue-600 shadow-2xs font-bold'
                    : 'text-gray-500 hover:text-gray-800'
                }`}
                title="卡片矩阵视图"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                  />
                </svg>
              </button>
              <button
                id="view_mode_table_btn"
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                  viewMode === 'table'
                    ? 'bg-white text-blue-600 shadow-2xs font-bold'
                    : 'text-gray-500 hover:text-gray-800'
                }`}
                title="明细列表视图"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-gray-500 pt-1">
          <div>
            共检索到 <span className="font-bold text-gray-900">{filteredInstitutions.length}</span>{' '}
            家机构
            {searchQuery && (
              <span className="ml-1 text-blue-600">（匹配关键词: "{searchQuery}"）</span>
            )}
          </div>
          <div className="text-gray-400">点击任意机构卡片或「进入监控」即可下钻对应机构</div>
        </div>
      </div>

      {/* ========================================== */}
      {/* Institutions View: GRID (Cards Matrix) */}
      {/* ========================================== */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5">
          {filteredInstitutions.map((inst) => {
            const subCount = inst.children ? inst.children.length : 0;
            const quotaPercent = Math.round((inst.qrUsed / inst.qrLimit) * 100);

            return (
              <div
                key={inst.id}
                id={`inst_card_${inst.id}`}
                onClick={() => onSelectInstitution(inst)}
                className="group bg-white rounded-2xl border border-gray-200/90 hover:border-blue-300 p-5 shadow-xs hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col justify-between relative overflow-hidden"
              >
                {/* Top Health & Status Badges */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-gray-100 text-gray-700 font-mono">
                        {inst.code}
                      </span>
                      <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-blue-50 text-blue-700">
                        {inst.industry}
                      </span>
                      <span
                        className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                          inst.statusType === '正式'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}
                      >
                        {inst.statusType}版
                      </span>
                    </div>

                    <div className="flex items-center gap-1">
                      <span
                        className={`w-2 h-2 rounded-full ${
                          inst.healthStatus === 'healthy'
                            ? 'bg-emerald-500'
                            : inst.healthStatus === 'busy'
                            ? 'bg-amber-500 animate-pulse'
                            : 'bg-rose-500 animate-ping'
                        }`}
                      />
                      <span
                        className={`text-[11px] font-medium ${
                          inst.healthStatus === 'healthy'
                            ? 'text-emerald-700'
                            : inst.healthStatus === 'busy'
                            ? 'text-amber-700'
                            : 'text-rose-700'
                        }`}
                      >
                        {inst.healthStatus === 'healthy'
                          ? '优良运行'
                          : inst.healthStatus === 'busy'
                          ? '待审高频'
                          : '预警关注'}
                      </span>
                    </div>
                  </div>

                  {/* Institution Name & Leader */}
                  <div>
                    <h3 className="text-sm font-bold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2 leading-snug">
                      {inst.name}
                    </h3>
                    <div className="flex items-center gap-3 text-xs text-gray-500 mt-1.5">
                      <span className="flex items-center gap-1">
                        <svg
                          className="w-3.5 h-3.5 text-gray-400"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                        {inst.region}
                      </span>
                      <span>·</span>
                      <span className="flex items-center gap-1">
                        <svg
                          className="w-3.5 h-3.5 text-gray-400"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                          />
                        </svg>
                        {inst.leader} ({inst.leaderPhone})
                      </span>
                    </div>
                  </div>

                  {/* 3 Core Metric Badges */}
                  <div className="grid grid-cols-3 gap-2 p-2.5 bg-gray-50/80 rounded-xl border border-gray-100 text-center">
                    <div>
                      <div className="text-[10px] text-gray-400">下辖子分支</div>
                      <div className="text-xs font-bold text-gray-900 mt-0.5">
                        {subCount > 0 ? `${subCount} 个二级部` : '直管网格'}
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] text-gray-400">在岗人员</div>
                      <div className="text-xs font-bold text-indigo-700 mt-0.5">
                        {inst.totalPersonnel} 人
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] text-gray-400">今日上报</div>
                      <div className="text-xs font-bold text-blue-600 mt-0.5">
                        {inst.todayReports} 件
                      </div>
                    </div>
                  </div>

                  {/* QR Quota Progress */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-gray-500">二维码配额占用</span>
                      <span className="font-mono text-gray-700 font-medium">
                        {inst.qrUsed} / {inst.qrLimit} ({quotaPercent}%)
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${
                          quotaPercent > 90
                            ? 'bg-rose-500'
                            : quotaPercent > 75
                            ? 'bg-amber-500'
                            : 'bg-blue-500'
                        }`}
                        style={{ width: `${Math.min(quotaPercent, 100)}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Card Footer: Pending Review & Enter Button */}
                <div className="pt-4 mt-4 border-t border-gray-100 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold ${
                        inst.pendingReview > 5
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      待审 {inst.pendingReview} 件
                    </span>
                    <span className="text-[11px] text-gray-400">
                      通过率 {inst.passRate}%
                    </span>
                  </div>

                  <button
                    id={`enter_inst_btn_${inst.id}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectInstitution(inst);
                    }}
                    className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-2xs group-hover:shadow-sm transition-all duration-150 active:scale-95 cursor-pointer"
                  >
                    <span>进入机构监控</span>
                    <svg className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ========================================== */}
      {/* Institutions View: TABLE (Detailed List) */}
      {/* ========================================== */}
      {viewMode === 'table' && (
        <div className="bg-white rounded-2xl border border-gray-200/90 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 border-b border-gray-200 text-gray-600 font-semibold select-none">
                <tr>
                  <th className="py-3.5 px-4">机构名称 / 编码</th>
                  <th className="py-3.5 px-3">所属行业</th>
                  <th className="py-3.5 px-3">地域 / 负责人</th>
                  <th className="py-3.5 px-3 text-center">子级分支</th>
                  <th className="py-3.5 px-3 text-center">在岗人员</th>
                  <th className="py-3.5 px-3 text-center">二维码占用</th>
                  <th className="py-3.5 px-3 text-center">今日上报</th>
                  <th className="py-3.5 px-3 text-center">待审核</th>
                  <th className="py-3.5 px-3 text-center">通过率</th>
                  <th className="py-3.5 px-3 text-center">健康状态</th>
                  <th className="py-3.5 px-4 text-right">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-gray-700">
                {filteredInstitutions.map((inst) => {
                  const subCount = inst.children ? inst.children.length : 0;
                  const quotaPercent = Math.round((inst.qrUsed / inst.qrLimit) * 100);

                  return (
                    <tr
                      key={inst.id}
                      onClick={() => onSelectInstitution(inst)}
                      className="hover:bg-blue-50/30 transition-colors cursor-pointer"
                    >
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-gray-900 hover:text-blue-600 transition-colors">
                          {inst.name}
                        </div>
                        <div className="text-[10px] text-gray-400 font-mono mt-0.5">
                          {inst.code} · {inst.statusType}版
                        </div>
                      </td>
                      <td className="py-3.5 px-3">
                        <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 text-[11px] font-medium">
                          {inst.industry}
                        </span>
                      </td>
                      <td className="py-3.5 px-3">
                        <div className="text-gray-800 font-medium">{inst.leader}</div>
                        <div className="text-[10px] text-gray-400">{inst.region}</div>
                      </td>
                      <td className="py-3.5 px-3 text-center font-mono font-medium">
                        {subCount > 0 ? `${subCount} 个` : '直管'}
                      </td>
                      <td className="py-3.5 px-3 text-center font-mono font-bold text-indigo-700">
                        {inst.totalPersonnel}
                      </td>
                      <td className="py-3.5 px-3 text-center font-mono">
                        <div className="text-[11px]">
                          {inst.qrUsed} / {inst.qrLimit}
                        </div>
                        <div className="text-[10px] text-gray-400">{quotaPercent}%</div>
                      </td>
                      <td className="py-3.5 px-3 text-center font-mono font-bold text-blue-600">
                        {inst.todayReports}
                      </td>
                      <td className="py-3.5 px-3 text-center font-mono">
                        <span
                          className={`px-2 py-0.5 rounded-full font-bold text-[11px] ${
                            inst.pendingReview > 5
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-gray-100 text-gray-600'
                          }`}
                        >
                          {inst.pendingReview}
                        </span>
                      </td>
                      <td className="py-3.5 px-3 text-center font-mono font-bold text-emerald-600">
                        {inst.passRate}%
                      </td>
                      <td className="py-3.5 px-3 text-center">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            inst.healthStatus === 'healthy'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : inst.healthStatus === 'busy'
                              ? 'bg-amber-50 text-amber-700 border border-amber-200'
                              : 'bg-rose-50 text-rose-700 border border-rose-200'
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              inst.healthStatus === 'healthy'
                                ? 'bg-emerald-500'
                                : inst.healthStatus === 'busy'
                                ? 'bg-amber-500'
                                : 'bg-rose-500'
                            }`}
                          />
                          {inst.healthStatus === 'healthy'
                            ? '优良'
                            : inst.healthStatus === 'busy'
                            ? '繁忙'
                            : '预警'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectInstitution(inst);
                          }}
                          className="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-[11px] font-semibold transition-all cursor-pointer shadow-2xs"
                        >
                          进入监控 ➔
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
