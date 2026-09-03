import React, { useMemo } from 'react';
import ReactECharts from 'echarts-for-react';
import {
  OrgTreeNode,
  mockPlatformOrgTreeData,
} from './monitoringData';
import { useSingleInstitutionMonitoringViewModel } from '../../viewmodels/useSingleInstitutionMonitoringViewModel';

interface SingleInstitutionMonitoringProps {
  institution: OrgTreeNode;
  onBackToHub: () => void;
  onSwitchInstitution: (inst: OrgTreeNode) => void;
}

export const SingleInstitutionMonitoring: React.FC<SingleInstitutionMonitoringProps> = ({
  institution,
  onBackToHub,
  onSwitchInstitution,
}) => {
  const { state, actions } = useSingleInstitutionMonitoringViewModel(institution);
  const {
    selectedSubNodeId,
    treeExpandedKeys,
    treeSearchQuery,
    activeTab,
    timeRange,
    isRefreshing,
    personnelSearch,
    eventCategoryFilter,
    eventStatusFilter,
    activeNode,
    activeNodeStats,
    flatSubBranches,
    relevantPersonnel,
    relevantEvents,
  } = state;
  const {
    setSelectedSubNodeId,
    setTreeSearchQuery,
    setActiveTab,
    setTimeRange,
    setPersonnelSearch,
    setEventCategoryFilter,
    setEventStatusFilter,
    handleRefresh,
    toggleTreeNode,
  } = actions;

  // ECharts: Hourly Trend Option
  const hourlyTrendChartOption = useMemo(() => {
    const multiplier = activeNode.todayReports > 100 ? 1 : 0.6;
    return {
      tooltip: {
        trigger: 'axis',
        backgroundColor: 'rgba(255, 255, 255, 0.98)',
        borderColor: '#e2e8f0',
        textStyle: { color: '#1e293b', fontSize: 12 },
      },
      legend: {
        data: ['上报事件量', '审核办结量', '待审堆积峰值'],
        top: '2%',
        right: '2%',
        icon: 'roundRect',
        textStyle: { color: '#64748b', fontSize: 11 },
      },
      grid: {
        left: '2%',
        right: '3%',
        bottom: '4%',
        top: '18%',
        containLabel: true,
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: ['00:00', '03:00', '06:00', '09:00', '12:00', '15:00', '18:00', '21:00'],
        axisLine: { lineStyle: { color: '#cbd5e1' } },
        axisLabel: { color: '#64748b', fontSize: 11 },
      },
      yAxis: {
        type: 'value',
        name: '件数 (件)',
        nameTextStyle: { color: '#94a3b8', fontSize: 10 },
        splitLine: { lineStyle: { type: 'dashed', color: '#f1f5f9' } },
        axisLabel: { color: '#64748b', fontSize: 11 },
      },
      series: [
        {
          name: '上报事件量',
          type: 'line',
          smooth: true,
          showSymbol: false,
          data: [42, 18, 95, 340, 480, 520, 410, 260].map((v) => Math.round(v * multiplier)),
          itemStyle: { color: '#3b82f6' },
          lineStyle: { width: 3 },
          areaStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                { offset: 0, color: 'rgba(59, 130, 246, 0.35)' },
                { offset: 1, color: 'rgba(59, 130, 246, 0.01)' },
              ],
            },
          },
        },
        {
          name: '审核办结量',
          type: 'line',
          smooth: true,
          showSymbol: false,
          data: [38, 16, 88, 310, 450, 495, 390, 245].map((v) => Math.round(v * multiplier)),
          itemStyle: { color: '#10b981' },
          lineStyle: { width: 3 },
          areaStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                { offset: 0, color: 'rgba(16, 185, 129, 0.3)' },
                { offset: 1, color: 'rgba(16, 185, 129, 0.01)' },
              ],
            },
          },
        },
        {
          name: '待审堆积峰值',
          type: 'line',
          smooth: true,
          showSymbol: false,
          data: [4, 2, 7, 30, 30, 25, 20, 15].map((v) => Math.round(v * multiplier)),
          itemStyle: { color: '#f59e0b' },
          lineStyle: { width: 2, type: 'dashed' },
        },
      ],
    };
  }, [activeNode]);

  // ECharts: Report Categories Breakdown
  const categoryPieChartOption = useMemo(() => {
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
          name: '事件分类占比',
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
          data: [
            { value: 45, name: '政务发布', itemStyle: { color: '#3b82f6' } },
            { value: 32, name: '舆情快报', itemStyle: { color: '#6366f1' } },
            { value: 28, name: '网格巡查', itemStyle: { color: '#10b981' } },
            { value: 18, name: '应急速报', itemStyle: { color: '#f59e0b' } },
            { value: 12, name: '不良举报', itemStyle: { color: '#ef4444' } },
            { value: 7, name: '重大事件', itemStyle: { color: '#8b5cf6' } },
          ],
        },
      ],
    };
  }, []);

  // ECharts: Sub-branches Contribution Chart
  const subBranchesRankingOption = useMemo(() => {
    const branches = flatSubBranches.slice(0, 5);
    if (branches.length === 0) {
      branches.push(institution);
    }
    return {
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'shadow' },
        backgroundColor: 'rgba(255, 255, 255, 0.98)',
        borderColor: '#e2e8f0',
        textStyle: { color: '#1e293b', fontSize: 12 },
      },
      grid: {
        left: '3%',
        right: '5%',
        top: '6%',
        bottom: '6%',
        containLabel: true,
      },
      xAxis: {
        type: 'value',
        splitLine: { lineStyle: { type: 'dashed', color: '#f1f5f9' } },
        axisLabel: { color: '#64748b', fontSize: 11 },
      },
      yAxis: {
        type: 'category',
        data: branches.map((b) => (b.name.length > 8 ? b.name.slice(0, 8) + '...' : b.name)).reverse(),
        axisLine: { lineStyle: { color: '#cbd5e1' } },
        axisLabel: { color: '#475569', fontSize: 11 },
      },
      series: [
        {
          name: '今日上报量',
          type: 'bar',
          barWidth: 12,
          data: branches.map((b) => b.todayReports).reverse(),
          itemStyle: { color: '#3b82f6', borderRadius: [0, 4, 4, 0] },
        },
        {
          name: '办结量',
          type: 'bar',
          barWidth: 12,
          data: branches.map((b) => b.reviewedToday).reverse(),
          itemStyle: { color: '#10b981', borderRadius: [0, 4, 4, 0] },
        },
      ],
    };
  }, [flatSubBranches, institution]);

  // Render Recursive Tree Nodes
  const renderSubTreeNode = (node: OrgTreeNode, depth = 0) => {
    const hasChildren = node.children && node.children.length > 0;
    const isExpanded = !!treeExpandedKeys[node.id];
    const isSelected = selectedSubNodeId === node.id;

    return (
      <div key={node.id} className="select-none">
        <div
          onClick={() => setSelectedSubNodeId(node.id)}
          className={`flex items-center justify-between px-2.5 py-2 rounded-xl text-xs transition-all cursor-pointer ${
            isSelected
              ? 'bg-blue-50 text-blue-800 font-semibold border border-blue-200/80 shadow-2xs'
              : 'hover:bg-gray-100/80 text-gray-700'
          }`}
          style={{ paddingLeft: `${depth * 14 + 10}px` }}
        >
          <div className="flex items-center gap-1.5 min-w-0 flex-1">
            {hasChildren ? (
              <button
                type="button"
                onClick={(e) => toggleTreeNode(node.id, e)}
                className="w-4 h-4 flex items-center justify-center text-gray-400 hover:text-gray-700 shrink-0 cursor-pointer"
              >
                <svg
                  className={`w-3 h-3 transition-transform ${isExpanded ? 'rotate-90 text-blue-600' : ''}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            ) : (
              <span className="w-4 shrink-0 text-gray-300 text-center">•</span>
            )}

            <span
              className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                node.healthStatus === 'healthy'
                  ? 'bg-emerald-500'
                  : node.healthStatus === 'busy'
                  ? 'bg-amber-500'
                  : 'bg-rose-500'
              }`}
            />

            <span className="truncate text-xs" title={node.name}>
              {node.name}
            </span>
          </div>

          <div className="flex items-center gap-1.5 shrink-0 ml-2">
            <span className="text-[10px] text-gray-400 font-mono">
              {node.totalPersonnel}人
            </span>
            <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-blue-100 text-blue-800 font-mono">
              {node.todayReports}件
            </span>
          </div>
        </div>

        {hasChildren && isExpanded && (
          <div className="space-y-0.5 mt-0.5">
            {node.children!.map((child) => renderSubTreeNode(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6 pb-12">
      {/* ========================================== */}
      {/* Top Header: Breadcrumb & Switcher */}
      {/* ========================================== */}
      <div className="bg-white rounded-2xl border border-gray-200/90 p-5 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-2">
            {/* Breadcrumb & Return Button */}
            <div className="flex items-center gap-2 flex-wrap text-xs text-gray-500">
              <button
                id="back_to_hub_btn"
                onClick={onBackToHub}
                className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 font-semibold px-2 py-1 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors cursor-pointer"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                <span>返回全平台机构列表</span>
              </button>
              <span>/</span>
              <span className="text-gray-400">全平台机构监控大厅</span>
              <span>/</span>
              <span className="font-semibold text-gray-800">{institution.name}</span>
            </div>

            {/* Title & Badges */}
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="text-lg sm:text-xl font-bold text-gray-900 tracking-tight">
                {institution.name}
              </h1>
              <span className="px-2 py-0.5 rounded text-xs font-mono font-semibold bg-gray-100 text-gray-700">
                {institution.code}
              </span>
              <span className="px-2 py-0.5 rounded text-xs font-medium bg-blue-50 text-blue-700">
                {institution.industry}
              </span>
              <span
                className={`px-2 py-0.5 rounded text-xs font-bold ${
                  institution.statusType === '正式'
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : 'bg-amber-50 text-amber-700 border border-amber-200'
                }`}
              >
                {institution.statusType}版
              </span>
              <span
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold ${
                  institution.healthStatus === 'healthy'
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : institution.healthStatus === 'busy'
                    ? 'bg-amber-50 text-amber-700 border border-amber-200'
                    : 'bg-rose-50 text-rose-700 border border-rose-200'
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    institution.healthStatus === 'healthy'
                      ? 'bg-emerald-500'
                      : institution.healthStatus === 'busy'
                      ? 'bg-amber-500 animate-pulse'
                      : 'bg-rose-500'
                  }`}
                />
                {institution.healthStatus === 'healthy'
                  ? '优良运行'
                  : institution.healthStatus === 'busy'
                  ? '待审高频'
                  : '预警关注'}
              </span>
            </div>

            {/* Leader & Region */}
            <div className="flex items-center gap-4 text-xs text-gray-500">
              <span>地域：{institution.region}</span>
              <span>·</span>
              <span>负责人：{institution.leader} ({institution.leaderPhone})</span>
              <span>·</span>
              <span className="text-gray-400">正在实时监控该机构及下辖分支</span>
            </div>
          </div>

          {/* Institution Switcher & Time Filter */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            {/* Quick Switch Dropdown */}
            <div className="flex items-center gap-1.5">
              <label htmlFor="quick_inst_switcher" className="text-xs text-gray-400">切换机构：</label>
              <select
                id="quick_inst_switcher"
                value={institution.id}
                onChange={(e) => {
                  const target = mockPlatformOrgTreeData.find((i) => i.id === e.target.value);
                  if (target) onSwitchInstitution(target);
                }}
                className="px-2.5 py-1.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer max-w-[200px] truncate"
              >
                {mockPlatformOrgTreeData.map((i) => (
                  <option key={i.id} value={i.id}>
                    {i.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Time Range Pills */}
            <div className="flex items-center bg-gray-100 p-0.5 rounded-xl border border-gray-200/80">
              {[
                { id: 'today', label: '今日实时' },
                { id: '7days', label: '近7天' },
                { id: '30days', label: '近30天' },
                { id: 'quarter', label: '本季度' },
              ].map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTimeRange(t.id as any)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                    timeRange === t.id
                      ? 'bg-white text-blue-600 shadow-2xs font-bold'
                      : 'text-gray-500 hover:text-gray-800'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            <button
              onClick={handleRefresh}
              className="p-1.5 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xl text-gray-600 transition-all cursor-pointer"
              title="刷新实时数据"
            >
              <svg
                className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-blue-600' : ''}`}
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
            </button>
          </div>
        </div>

        {/* 6 Metric KPI Cards for Selected Node */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-4 mt-4 border-t border-gray-100">
          <div className="p-3 bg-blue-50/50 rounded-xl border border-blue-100/60">
            <div className="text-[11px] font-medium text-blue-800">下辖子分支 / 网格</div>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-xl font-bold font-mono text-blue-900">
                {activeNodeStats.subBranchesCount}
              </span>
              <span className="text-[10px] text-blue-700">个</span>
            </div>
            <div className="text-[10px] text-blue-600/80 mt-0.5">
              {activeNodeStats.isRoot ? '本机构全部分支' : '当前节点子集'}
            </div>
          </div>

          <div className="p-3 bg-indigo-50/50 rounded-xl border border-indigo-100/60">
            <div className="text-[11px] font-medium text-indigo-800">在岗采编/审核人员</div>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-xl font-bold font-mono text-indigo-900">
                {activeNodeStats.totalPersonnel}
              </span>
              <span className="text-[10px] text-indigo-700">人</span>
            </div>
            <div className="text-[10px] text-indigo-600/80 mt-0.5">
              活跃 {activeNodeStats.activePersonnel} 人 (
              {Math.round((activeNodeStats.activePersonnel / activeNodeStats.totalPersonnel) * 100)}%)
            </div>
          </div>

          <div className="p-3 bg-violet-50/50 rounded-xl border border-violet-100/60">
            <div className="text-[11px] font-medium text-violet-800">二维码配额使用</div>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-xl font-bold font-mono text-violet-900">
                {activeNodeStats.qrUsed}
              </span>
              <span className="text-[10px] text-violet-700">/ {activeNodeStats.qrLimit}</span>
            </div>
            <div className="text-[10px] text-violet-600/80 mt-0.5">
              占用率 {Math.round((activeNodeStats.qrUsed / activeNodeStats.qrLimit) * 100)}%
            </div>
          </div>

          <div className="p-3 bg-emerald-50/50 rounded-xl border border-emerald-100/60">
            <div className="text-[11px] font-medium text-emerald-800">今日上报事件量</div>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-xl font-bold font-mono text-emerald-900">
                {activeNodeStats.todayReports}
              </span>
              <span className="text-[10px] text-emerald-700">件</span>
            </div>
            <div className="text-[10px] text-emerald-600/80 mt-0.5">
              已办结 {activeNodeStats.reviewedToday} 件
            </div>
          </div>

          <div className="p-3 bg-amber-50/50 rounded-xl border border-amber-100/60">
            <div className="text-[11px] font-medium text-amber-800">待审核/流转工单</div>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-xl font-bold font-mono text-amber-900">
                {activeNodeStats.pendingReview}
              </span>
              <span className="text-[10px] text-amber-700">件</span>
            </div>
            <div className="text-[10px] text-amber-600/80 mt-0.5">
              初审/终审进行中
            </div>
          </div>

          <div className="p-3 bg-cyan-50/50 rounded-xl border border-cyan-100/60">
            <div className="text-[11px] font-medium text-cyan-800">审核通过率与时效</div>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-xl font-bold font-mono text-cyan-900">
                {activeNodeStats.passRate}%
              </span>
            </div>
            <div className="text-[10px] text-cyan-600/80 mt-0.5">
              平均 {activeNodeStats.avgReviewMinutes} 分钟办结
            </div>
          </div>
        </div>
      </div>

      {/* ========================================== */}
      {/* Main Content Layout: Tree (Left) + Tabs (Right) */}
      {/* ========================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column: Organization Tree */}
        <div className="lg:col-span-4 xl:col-span-3 space-y-4">
          <div className="bg-white rounded-2xl border border-gray-200/90 p-4 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-4 bg-blue-600 rounded-full" />
                <h2 className="text-xs font-bold text-gray-900">下属组织架构与网格树</h2>
              </div>
              <button
                onClick={() => setSelectedSubNodeId('ROOT')}
                className="text-[11px] text-blue-600 hover:text-blue-800 font-medium cursor-pointer"
              >
                重置查看全机构
              </button>
            </div>

            {/* Tree Search */}
            <div className="mt-3 relative">
              <input
                type="text"
                value={treeSearchQuery}
                onChange={(e) => setTreeSearchQuery(e.target.value)}
                placeholder="搜索科室/网格站点..."
                className="w-full pl-8 pr-3 py-1.5 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
              <svg
                className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>

            {/* Tree Nodes List */}
            <div className="mt-3 space-y-1 max-h-[520px] overflow-y-auto pr-1">
              {renderSubTreeNode(institution, 0)}
            </div>

            <div className="pt-3 mt-3 border-t border-gray-100 text-[11px] text-gray-400 flex items-center justify-between">
              <span>点击树节点可在右侧下钻查看</span>
              <span className="font-mono text-blue-600">{activeNodeStats.scopeName.slice(0, 10)}...</span>
            </div>
          </div>
        </div>

        {/* Right Column: 4 Tabbed Workspaces */}
        <div className="lg:col-span-8 xl:col-span-9 space-y-4">
          {/* Sub Navigation Tabs */}
          <div className="bg-white rounded-2xl border border-gray-200/90 p-2 shadow-xs flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-1">
              {[
                { id: 'overview', label: '综合运营走势', count: null },
                { id: 'personnel', label: '人员履职效能', count: relevantPersonnel.length },
                { id: 'pipeline', label: '上报与审核流转', count: relevantEvents.length },
                { id: 'matrix', label: '子级机构矩阵对比', count: flatSubBranches.length },
              ].map((tab) => (
                <button
                  key={tab.id}
                  id={`tab_btn_${tab.id}`}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                    activeTab === tab.id
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-gray-600 hover:bg-gray-100/80 hover:text-gray-900'
                  }`}
                >
                  <span>{tab.label}</span>
                  {tab.count !== null && (
                    <span
                      className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                        activeTab === tab.id
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-200/80 text-gray-700'
                      }`}
                    >
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}
            </div>

            <div className="text-xs text-gray-400 px-2 hidden sm:block">
              当前层级：<span className="font-bold text-gray-800">{activeNode.name}</span>
            </div>
          </div>

          {/* TAB 1: 综合运营走势 */}
          {activeTab === 'overview' && (
            <div className="space-y-4">
              {/* Hourly Trend EChart */}
              <div className="bg-white rounded-2xl border border-gray-200/90 p-5 shadow-xs">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-4 bg-blue-600 rounded-full" />
                    <h3 className="text-sm font-bold text-gray-900">
                      今日 24 小时事件上报、审核办结与待审峰值时序图
                    </h3>
                  </div>
                  <span className="text-xs text-gray-400">实时刷新</span>
                </div>
                <div className="h-[260px]">
                  <ReactECharts
                    option={hourlyTrendChartOption}
                    style={{ height: '100%', width: '100%' }}
                    opts={{ renderer: 'svg' }}
                  />
                </div>
              </div>

              {/* Two Column Charts: Categories & Sub-branches Ranking */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white rounded-2xl border border-gray-200/90 p-5 shadow-xs">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-4 bg-indigo-600 rounded-full" />
                      <h3 className="text-sm font-bold text-gray-900">事件类型上报占比</h3>
                    </div>
                  </div>
                  <div className="h-[220px]">
                    <ReactECharts
                      option={categoryPieChartOption}
                      style={{ height: '100%', width: '100%' }}
                      opts={{ renderer: 'svg' }}
                    />
                  </div>
                </div>

                <div className="bg-white rounded-2xl border border-gray-200/90 p-5 shadow-xs">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-4 bg-emerald-600 rounded-full" />
                      <h3 className="text-sm font-bold text-gray-900">下辖各子分支贡献排行</h3>
                    </div>
                  </div>
                  <div className="h-[220px]">
                    <ReactECharts
                      option={subBranchesRankingOption}
                      style={{ height: '100%', width: '100%' }}
                      opts={{ renderer: 'svg' }}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: 人员履职效能 */}
          {activeTab === 'personnel' && (
            <div className="bg-white rounded-2xl border border-gray-200/90 p-5 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-4 bg-indigo-600 rounded-full" />
                  <h3 className="text-sm font-bold text-gray-900">在岗采编人员与审核专员履职效能</h3>
                </div>
                <div className="relative max-w-xs w-full">
                  <input
                    type="text"
                    value={personnelSearch}
                    onChange={(e) => setPersonnelSearch(e.target.value)}
                    placeholder="搜索人员姓名、电话、岗位或科室..."
                    className="w-full pl-8 pr-3 py-1.5 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                  <svg
                    className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>

              {/* Personnel Table */}
              <div className="border border-gray-200/80 rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-gray-50 border-b border-gray-200 text-gray-600 font-semibold select-none">
                      <tr>
                        <th className="py-3 px-4">人员姓名</th>
                        <th className="py-3 px-3">所属岗位角色</th>
                        <th className="py-3 px-3">所在子机构/科室</th>
                        <th className="py-3 px-3 text-center">今日上报</th>
                        <th className="py-3 px-3 text-center">今日审核</th>
                        <th className="py-3 px-3 text-center">通过率</th>
                        <th className="py-3 px-3 text-center">平均响应时效</th>
                        <th className="py-3 px-4 text-right">在线状态</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-gray-700">
                      {relevantPersonnel.map((p) => (
                        <tr key={p.id} className="hover:bg-gray-50/80 transition-colors">
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold ${p.avatarColor}`}>
                                {p.name.slice(0, 1)}
                              </div>
                              <div>
                                <div className="font-bold text-gray-900">{p.name}</div>
                                <div className="text-[10px] text-gray-400 font-mono">{p.phone}</div>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-3">
                            <span className="px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 text-[11px] font-medium">
                              {p.role}
                            </span>
                          </td>
                          <td className="py-3 px-3 text-gray-600">{p.subBranchName}</td>
                          <td className="py-3 px-3 text-center font-mono font-bold text-blue-600">
                            {p.todayReports > 0 ? `${p.todayReports} 篇` : '-'}
                          </td>
                          <td className="py-3 px-3 text-center font-mono font-bold text-emerald-600">
                            {p.todayReviewed > 0 ? `${p.todayReviewed} 篇` : '-'}
                          </td>
                          <td className="py-3 px-3 text-center font-mono font-bold text-gray-800">
                            {p.passRate}%
                          </td>
                          <td className="py-3 px-3 text-center font-mono text-gray-600">
                            {p.avgResponseMins} 分钟
                          </td>
                          <td className="py-3 px-4 text-right">
                            <span
                              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                p.status === 'online'
                                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                  : p.status === 'busy'
                                  ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                  : 'bg-gray-100 text-gray-600'
                              }`}
                            >
                              <span
                                className={`w-1.5 h-1.5 rounded-full ${
                                  p.status === 'online'
                                    ? 'bg-emerald-500'
                                    : p.status === 'busy'
                                    ? 'bg-amber-500'
                                    : 'bg-gray-400'
                                }`}
                              />
                              {p.status === 'online'
                                ? '在线'
                                : p.status === 'busy'
                                ? '审核中'
                                : '离线'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: 上报与审核流转 */}
          {activeTab === 'pipeline' && (
            <div className="bg-white rounded-2xl border border-gray-200/90 p-5 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-4 bg-blue-600 rounded-full" />
                  <h3 className="text-sm font-bold text-gray-900">采编上报与初审/终审实时流水日志</h3>
                </div>

                <div className="flex items-center gap-2">
                  <select
                    value={eventCategoryFilter}
                    onChange={(e) => setEventCategoryFilter(e.target.value)}
                    aria-label="事件分类筛选"
                    className="px-2.5 py-1.5 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-700"
                  >
                    <option value="ALL">全部事件分类</option>
                    <option value="政务发布">政务发布</option>
                    <option value="舆情快报">舆情快报</option>
                    <option value="网格巡查">网格巡查</option>
                    <option value="应急速报">应急速报</option>
                    <option value="不良举报">不良举报</option>
                  </select>

                  <select
                    value={eventStatusFilter}
                    onChange={(e) => setEventStatusFilter(e.target.value)}
                    aria-label="工单流转状态筛选"
                    className="px-2.5 py-1.5 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-700"
                  >
                    <option value="ALL">全部流转状态</option>
                    <option value="approved">已终审通过</option>
                    <option value="pending_first">待初审</option>
                    <option value="pending_final">待终审复核</option>
                    <option value="rejected">已退回修改</option>
                  </select>
                </div>
              </div>

              {/* Event Stream Cards */}
              <div className="space-y-3">
                {relevantEvents.map((evt) => (
                  <div
                    key={evt.id}
                    className="p-4 rounded-xl border border-gray-100 bg-gray-50/50 hover:bg-white hover:border-gray-200 transition-all space-y-2"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800">
                            {evt.category}
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              evt.urgency === '高'
                                ? 'bg-rose-100 text-rose-800'
                                : evt.urgency === '中'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-gray-100 text-gray-700'
                            }`}
                          >
                            紧急程度: {evt.urgency}
                          </span>
                          <span className="text-xs text-gray-400 font-mono">{evt.id}</span>
                        </div>
                        <h4 className="text-sm font-bold text-gray-900">{evt.title}</h4>
                      </div>

                      <span
                        className={`shrink-0 px-2.5 py-1 rounded-full text-xs font-bold ${
                          evt.status === 'approved'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : evt.status === 'pending_first'
                            ? 'bg-blue-50 text-blue-700 border border-blue-200'
                            : evt.status === 'pending_final'
                            ? 'bg-purple-50 text-purple-700 border border-purple-200'
                            : 'bg-rose-50 text-rose-700 border border-rose-200'
                        }`}
                      >
                        {evt.status === 'approved'
                          ? '✓ 审核通过已发布'
                          : evt.status === 'pending_first'
                          ? '⏳ 待初审'
                          : evt.status === 'pending_final'
                          ? '⏳ 待终审复核'
                          : '✕ 驳回修改'}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500 pt-1">
                      <span>采编：{evt.reporterName} ({evt.reporterRole})</span>
                      <span>·</span>
                      <span>科室：{evt.subBranchName}</span>
                      <span>·</span>
                      <span>上报时间：{evt.reportTime}</span>
                      {evt.reviewerName && (
                        <>
                          <span>·</span>
                          <span className="text-emerald-700 font-medium">
                            审核人：{evt.reviewerName} (耗时 {evt.durationMins} 分钟)
                          </span>
                        </>
                      )}
                    </div>

                    {evt.rejectReason && (
                      <div className="p-2.5 bg-rose-50 rounded-lg text-xs text-rose-700 border border-rose-100 mt-1">
                        驳回原因：{evt.rejectReason}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: 子级机构矩阵对比 */}
          {activeTab === 'matrix' && (
            <div className="bg-white rounded-2xl border border-gray-200/90 p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-4 bg-blue-600 rounded-full" />
                  <h3 className="text-sm font-bold text-gray-900">
                    下辖子级机构与基层网格运行指标矩阵
                  </h3>
                </div>
                <span className="text-xs text-gray-400">共 {flatSubBranches.length} 个子级节点</span>
              </div>

              <div className="border border-gray-200/80 rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-gray-50 border-b border-gray-200 text-gray-600 font-semibold select-none">
                      <tr>
                        <th className="py-3 px-4">子机构/网格名称</th>
                        <th className="py-3 px-4">行业/属性</th>
                        <th className="py-3 px-4">主管责任人</th>
                        <th className="py-3 px-4 text-center">人员编制/二维码</th>
                        <th className="py-3 px-4 text-center">今日上报</th>
                        <th className="py-3 px-4 text-center">待审积压</th>
                        <th className="py-3 px-4 text-center">审核通过率</th>
                        <th className="py-3 px-4 text-center">平均时效</th>
                        <th className="py-3 px-4 text-right">健康评级</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-gray-700">
                      {flatSubBranches.map((sub) => (
                        <tr key={sub.id} className="hover:bg-blue-50/20 transition-colors">
                          <td className="py-3 px-4">
                            <div className="font-bold text-gray-900">{sub.name}</div>
                            <div className="text-[10px] text-gray-400 font-mono">
                              {sub.code} · {sub.region}
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <span className="px-2 py-0.5 rounded bg-gray-100 text-gray-700 text-[11px]">
                              {sub.industry}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <div className="font-medium text-gray-800">{sub.leader}</div>
                            <div className="text-[10px] text-gray-400 font-mono">
                              {sub.leaderPhone}
                            </div>
                          </td>
                          <td className="py-3 px-4 text-center font-mono">
                            <span className="font-bold text-gray-900">{sub.totalPersonnel}</span>
                            <span className="text-gray-400 text-[11px]"> / {sub.qrLimit} 额度</span>
                          </td>
                          <td className="py-3 px-4 text-center font-mono font-bold text-blue-600">
                            {sub.todayReports} 件
                          </td>
                          <td className="py-3 px-4 text-center font-mono">
                            <span
                              className={`px-2 py-0.5 rounded-full font-bold text-[11px] ${
                                sub.pendingReview > 3
                                  ? 'bg-amber-100 text-amber-800'
                                  : 'bg-gray-100 text-gray-600'
                              }`}
                            >
                              {sub.pendingReview} 件
                            </span>
                          </td>
                          <td className="py-3 px-4 text-center font-mono font-bold text-emerald-600">
                            {sub.passRate}%
                          </td>
                          <td className="py-3 px-4 text-center font-mono text-gray-600">
                            {sub.avgReviewMinutes} 分钟
                          </td>
                          <td className="py-3 px-4 text-right">
                            <span
                              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold ${
                                sub.healthStatus === 'healthy'
                                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                  : sub.healthStatus === 'busy'
                                  ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                  : 'bg-rose-50 text-rose-700 border border-rose-200'
                              }`}
                            >
                              <span
                                className={`w-1.5 h-1.5 rounded-full ${
                                  sub.healthStatus === 'healthy'
                                    ? 'bg-emerald-500'
                                    : sub.healthStatus === 'busy'
                                    ? 'bg-amber-500'
                                    : 'bg-rose-500'
                                }`}
                              />
                              {sub.healthStatus === 'healthy'
                                ? '优良运行'
                                : sub.healthStatus === 'busy'
                                ? '待审较多'
                                : '预警关注'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
