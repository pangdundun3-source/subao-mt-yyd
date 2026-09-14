import React from 'react';
import {
  MpMigrationConfig,
  MpMigrationTask,
  MpPersonnelMigrationItem,
  WechatMpConfig,
} from '../../types';
import { useMpPersonnelMigrationViewModel } from '../../viewmodels/useMpPersonnelMigrationViewModel';

export const mockMigrationPersonnel: MpPersonnelMigrationItem[] = [
  {
    id: 'p-1',
    name: '张建国',
    phone: '138****9201',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80',
    department: '新闻采编一部',
    role: '首席采编员',
    sourceOpenId: 'oZ4_ddsb_918237192',
    sourceMp: '点点速报 (平台统配)',
    targetMp: '随州融媒发布 (官方服务号)',
    targetOpenId: 'oZ4_szmt_881920194',
    status: 'completed',
    matchedVia: 'union_id',
    migratedTime: '2026-08-28 10:14:22',
    inheritedDraftsCount: 24,
    inheritedPoints: 1280,
    remindCount: 1,
    lastRemindTime: '2026-08-28 10:00:00',
  },
  {
    id: 'p-2',
    name: '李雅婷',
    phone: '139****1182',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80',
    department: '时政融媒组',
    role: '责任编辑',
    sourceOpenId: 'oZ4_ddsb_771928310',
    sourceMp: '点点速报 (平台统配)',
    targetMp: '随州融媒发布 (官方服务号)',
    targetOpenId: 'oZ4_szmt_772910381',
    status: 'completed',
    matchedVia: 'union_id',
    migratedTime: '2026-08-28 10:18:05',
    inheritedDraftsCount: 38,
    inheritedPoints: 2150,
    remindCount: 1,
    lastRemindTime: '2026-08-28 10:00:00',
  },
  {
    id: 'p-3',
    name: '王少华',
    phone: '137****6631',
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=120&auto=format&fit=crop&q=80',
    department: '民生舆情部',
    role: '采编组长',
    sourceOpenId: 'oZ4_ddsb_119283745',
    sourceMp: '点点速报 (平台统配)',
    targetMp: '随州融媒发布 (官方服务号)',
    targetOpenId: 'oZ4_szmt_551829031',
    status: 'completed',
    matchedVia: 'sms_invite',
    migratedTime: '2026-08-28 11:05:40',
    inheritedDraftsCount: 15,
    inheritedPoints: 890,
    remindCount: 1,
    lastRemindTime: '2026-08-28 10:00:00',
  },
  {
    id: 'p-4',
    name: '陈思敏',
    phone: '136****5519',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=120&auto=format&fit=crop&q=80',
    department: '新媒体运营中心',
    role: '运营编辑',
    sourceOpenId: 'oZ4_ddsb_441829301',
    sourceMp: '点点速报 (平台统配)',
    targetMp: '随州融媒发布 (官方服务号)',
    status: 'pending_scan',
    inheritedDraftsCount: 19,
    inheritedPoints: 940,
    remindCount: 2,
    lastRemindTime: '2026-08-29 09:30:00',
  },
  {
    id: 'p-5',
    name: '赵子轩',
    phone: '135****4428',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
    department: '短视频制作组',
    role: '视频编导',
    sourceOpenId: 'oZ4_ddsb_662819034',
    sourceMp: '点点速报 (平台统配)',
    targetMp: '随州融媒发布 (官方服务号)',
    status: 'pending_scan',
    inheritedDraftsCount: 9,
    inheritedPoints: 460,
    remindCount: 2,
    lastRemindTime: '2026-08-29 09:30:00',
  },
  {
    id: 'p-6',
    name: '孙晓雨',
    phone: '139****8820',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&auto=format&fit=crop&q=80',
    department: '审核把关办公室',
    role: '二级审稿员',
    sourceOpenId: 'oZ4_ddsb_882910394',
    sourceMp: '点点速报 (平台统配)',
    targetMp: '随州融媒发布 (官方服务号)',
    status: 'not_started',
    inheritedDraftsCount: 42,
    inheritedPoints: 3100,
    remindCount: 0,
  },
];

export const mockMigrationTasks: MpMigrationTask[] = [
  {
    id: 'TASK-20260828-01',
    taskBatchNo: 'BATCH-20260828-01',
    taskName: '【随州融媒】全员公众号换绑跨号迁移任务',
    sourceMpName: '点点速报 (平台统配)',
    targetMpName: '随州融媒发布 (官方服务号)',
    totalPersonnel: 6,
    completedCount: 3,
    pendingCount: 2,
    failedCount: 0,
    channels: ['wechat_card', 'sms', 'qr_poster'],
    status: 'in_progress',
    createdAt: '2026-08-28 10:00:00',
    operator: '系统管理员 (廖伟)',
    progressPercentage: 50,
    remark: '全员定向推送换绑卡片与短信提醒',
  },
];

interface MpPersonnelMigrationSectionProps {
  institutionName: string;
  mpConfig?: WechatMpConfig;
  migrationConfig?: MpMigrationConfig;
  onChangeMigration: (newConfig: MpMigrationConfig) => void;
  showToast: (msg: string, type?: 'success' | 'warning' | 'info') => void;
  onNavigateToMpConfig?: () => void;
}

export const MpPersonnelMigrationSection: React.FC<MpPersonnelMigrationSectionProps> = ({
  institutionName,
  mpConfig,
  migrationConfig,
  onChangeMigration,
  showToast,
  onNavigateToMpConfig,
}) => {
  const { state, actions } = useMpPersonnelMigrationViewModel({
    institutionName,
    mpConfig,
    migrationConfig,
    defaultPersonnel: mockMigrationPersonnel,
    defaultTasks: mockMigrationTasks,
    onChangeMigration,
    showToast,
    onNavigateToMpConfig,
  });

  const {
    personnelList,
    tasks,
    searchQuery,
    statusFilter,
    showTaskDrawer,
    showPrincipleHelp,
    showConfirmModal,
    confirmModalType,
    targetPersonToMigrate,
    isLaunching,
    selectedPersonForQr,
    sourceMpName,
    targetMpName,
    isCustomBound,
    channelText,
    totalCount,
    completedCount,
    pendingCount,
    completionRate,
    filteredList,
  } = state;

  const {
    setSearchQuery,
    setStatusFilter,
    setShowTaskDrawer,
    setShowPrincipleHelp,
    openConfirmModalForAll,
    openConfirmModalForSingle,
    closeConfirmModal,
    handleExecuteConfirmedMigration,
    setSelectedPersonForQr,
    handleManualConfirmMigration,
  } = actions;

  return (
    <div className="space-y-4 text-gray-800">
      {/* 1. 核心看板：公众号换绑路线与全景状态看板 */}
      <div className="bg-white rounded-xl border border-gray-200/80 p-4 sm:p-5 shadow-2xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3.5 border-b border-gray-100">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-gray-900">人员换绑迁移通道</h3>
              <span
                className={`text-[11px] px-2 py-0.5 rounded-full font-medium border ${
                  isCustomBound
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    : 'bg-amber-50 text-amber-700 border-amber-200'
                }`}
              >
                {isCustomBound ? '已完成公众号换绑 · 可开始人员迁移' : '未完成公众号换绑 · 人员迁移暂未开放'}
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-0.5">
              明确采编人员迁移的源头公众号与换绑目标公众号，向人员定向发送换绑卡片与短信，扫码即可绑定新号
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={openConfirmModalForAll}
              disabled={!isCustomBound || isLaunching}
              className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-[#1890ff] text-white hover:bg-blue-600 shadow-2xs transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
              title={!isCustomBound ? '必须先在公众号配置中完成换绑，才能发起人员迁移' : '确认后向全员发起跨号迁移通知'}
            >
              <span className="material-symbols-outlined text-[16px]">send</span>
              <span>发起全员换绑迁移</span>
            </button>

            <button
              type="button"
              onClick={() => setShowTaskDrawer(true)}
              className="px-2.5 py-1.5 rounded-lg text-xs font-medium text-gray-600 hover:text-gray-900 bg-gray-100 hover:bg-gray-200/80 transition-colors flex items-center gap-1 cursor-pointer whitespace-nowrap"
            >
              <span className="material-symbols-outlined text-[16px]">history</span>
              <span>记录 ({tasks.length})</span>
            </button>
          </div>
        </div>

        {/* 跨号换绑迁移路线可视化卡片 (让用户清晰知道从哪个公众号迁移到哪个公众号) */}
        <div className="grid grid-cols-1 md:grid-cols-7 gap-3 items-center bg-gray-50/70 p-3.5 rounded-xl border border-gray-200/80">
          {/* 左侧：原公众号 (迁出方) */}
          <div className="md:col-span-3 bg-white p-3.5 rounded-lg border border-gray-200/80 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-[11px] px-2 py-0.5 rounded font-bold bg-gray-100 text-gray-600">
                原公众号 (迁出方)
              </span>
              <span className="text-[11px] text-gray-400">历史资产源</span>
            </div>
            <div className="flex items-center gap-2.5 mt-2">
              <div className="w-8 h-8 rounded-lg bg-gray-100 text-gray-600 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[18px]">public</span>
              </div>
              <div className="min-w-0">
                <h4 className="text-xs font-bold text-gray-900 truncate">{sourceMpName}</h4>
                <div className="text-[11px] text-gray-500 truncate mt-0.5">
                  全量继承历史稿件箱、采编积分与审稿权限
                </div>
              </div>
            </div>
          </div>

          {/* 中间：换绑流向指示器 */}
          <div className="md:col-span-1 flex flex-col items-center justify-center py-1">
            <div className="w-8 h-8 rounded-full bg-blue-100 text-[#1890ff] flex items-center justify-center shadow-2xs">
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </div>
            <span className="text-[10px] text-blue-600 font-semibold mt-1">跨号换绑</span>
          </div>

          {/* 右侧：目标公众号 (迁入方) */}
          <div className="md:col-span-3 bg-white p-3.5 rounded-lg border border-blue-200/80 ring-1 ring-blue-100 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-[11px] px-2 py-0.5 rounded font-bold bg-blue-50 text-[#1890ff]">
                目标公众号 (迁入方)
              </span>
              <span className="text-[11px] text-emerald-600 font-medium">当前已换绑启用</span>
            </div>
            <div className="flex items-center gap-2.5 mt-2">
              <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[18px]">verified</span>
              </div>
              <div className="min-w-0">
                <h4 className="text-xs font-bold text-gray-900 truncate">{targetMpName}</h4>
                <div className="text-[11px] text-gray-500 truncate mt-0.5">
                  采编人员扫码关注后自动绑定为新发稿通道
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 前置拦截引导卡片（如果尚未换绑至自有公众号） */}
        {!isCustomBound && (
          <div className="p-4 rounded-xl bg-amber-50/90 border border-amber-200 text-amber-900 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-start gap-3">
              <span className="material-symbols-outlined text-[24px] text-amber-600 shrink-0 mt-0.5">
                lock
              </span>
              <div>
                <h4 className="text-xs font-bold text-amber-950">
                  当前处于未换绑状态，无法发起采编人员跨号迁移
                </h4>
                <p className="text-xs text-amber-800 mt-0.5">
                  当前机构仍在使用平台默认号【点点速报】。向人员发起换绑通知前，必须先在「公众号配置」中添加并<strong>【执行换绑】</strong>至自有公众号，确立迁入目标后方可操作。
                </p>
              </div>
            </div>

            {onNavigateToMpConfig && (
              <button
                type="button"
                onClick={onNavigateToMpConfig}
                className="px-4 py-2 rounded-lg text-xs font-bold bg-amber-600 text-white hover:bg-amber-700 shadow-2xs transition-all flex items-center gap-1.5 shrink-0 self-start sm:self-auto cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">sync_alt</span>
                <span>立即前往公众号配置进行换绑</span>
              </button>
            )}
          </div>
        )}

        {/* 迁移进度与统计条 */}
        <div className="p-3 rounded-xl bg-gray-50/90 border border-gray-200/80 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-3 sm:gap-5">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-gray-700">换绑总进度</span>
              <div className="w-24 sm:w-32 bg-gray-200 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-[#1890ff] h-full rounded-full transition-all duration-500"
                  style={{ width: `${completionRate}%` }}
                />
              </div>
              <span className="font-bold text-[#1890ff] font-mono">{completionRate}%</span>
            </div>

            <div className="h-3 w-px bg-gray-300 hidden sm:block" />

            <div className="flex items-center gap-4 text-xs">
              <span className="text-emerald-700 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                已完成：<strong>{completedCount}</strong> 人
              </span>
              <span className="text-amber-700 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                待换绑：<strong>{pendingCount}</strong> 人
              </span>
              <span className="text-gray-500">
                共计 <strong>{totalCount}</strong> 人
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowPrincipleHelp(!showPrincipleHelp)}
            className="text-gray-500 hover:text-[#1890ff] flex items-center gap-1 font-medium cursor-pointer text-xs shrink-0 self-end md:self-auto"
          >
            <span className="material-symbols-outlined text-[14px] text-[#1890ff]">help_outline</span>
            <span>{showPrincipleHelp ? '收起换绑说明' : '人员换绑指引'}</span>
          </button>
        </div>

        {/* 展开的换绑说明 */}
        {showPrincipleHelp && (
          <div className="p-3 rounded-lg bg-blue-50/60 border border-blue-100 text-xs space-y-1.5 text-gray-600 animate-fade-in">
            <div className="font-bold text-blue-900 flex items-center gap-1">
              <span className="material-symbols-outlined text-[15px] text-[#1890ff]">check_circle</span>
              <span>人员换绑全流程机制：</span>
            </div>
            <ol className="list-decimal pl-4 space-y-1 text-gray-600 text-[11px] leading-relaxed">
              <li>
                <strong>前置条件：</strong>管理员必须在「公众号配置」中完成自有服务号换绑，锁定目标公众号；
              </li>
              <li>
                <strong>安全确认：</strong>每次发起全员或单人换绑时，系统弹窗明确展示<strong>从原公众号（{sourceMpName}）迁移至目标公众号（{targetMpName}）</strong>；
              </li>
              <li>
                <strong>无损继承：</strong>采编人员通过微信推送卡片或扫码关注新公众号后，微信 UnionID 自动建立映射，历史草稿、审签流、采编积分 100% 自动结转；
              </li>
              <li>
                <strong>兜底保障：</strong>若采编人员未及时查看通知，可点击其行右侧的「专属码」发送微信，或由管理员核实后点击「人工确认」。
              </li>
            </ol>
          </div>
        )}
      </div>

      {/* 2. 人员列表与换绑操作区 */}
      <div className="bg-white rounded-xl border border-gray-200/80 p-4 sm:p-5 shadow-2xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          {/* 状态筛选 Tabs */}
          <div className="flex items-center bg-gray-100/90 p-0.5 rounded-lg text-xs">
            <button
              type="button"
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1 rounded-md font-medium cursor-pointer transition-all ${
                statusFilter === 'all'
                  ? 'bg-white text-gray-900 shadow-2xs font-bold'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              全部人员 ({totalCount})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter('pending_scan')}
              className={`px-3 py-1 rounded-md font-medium cursor-pointer transition-all ${
                statusFilter === 'pending_scan'
                  ? 'bg-white text-amber-700 shadow-2xs font-bold'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              待换绑 ({pendingCount})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter('completed')}
              className={`px-3 py-1 rounded-md font-medium cursor-pointer transition-all ${
                statusFilter === 'completed'
                  ? 'bg-white text-emerald-700 shadow-2xs font-bold'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              已换绑 ({completedCount})
            </button>
          </div>

          {/* 搜索 */}
          <div className="relative">
            <span className="material-symbols-outlined absolute left-2.5 top-2 text-gray-400 text-[14px]">
              search
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="搜索人员姓名或手机号..."
              className="pl-7 pr-2.5 py-1.5 text-xs bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:outline-none focus:border-[#1890ff] w-48"
            />
          </div>
        </div>

        {/* 人员换绑表格 */}
        <div className="border border-gray-200/90 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs min-w-[700px]">
              <thead className="bg-gray-50/80 border-b border-gray-200 text-gray-500 font-medium select-none">
                <tr>
                  <th className="py-2.5 px-3.5">采编人员</th>
                  <th className="py-2.5 px-3.5">部门与角色</th>
                  <th className="py-2.5 px-3.5">换绑路线 (原号 → 新号)</th>
                  <th className="py-2.5 px-3.5">继承资产</th>
                  <th className="py-2.5 px-3.5">状态</th>
                  <th className="py-2.5 px-3.5 text-right">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-gray-700">
                {filteredList.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-gray-400">
                      未找到符合条件的采编人员
                    </td>
                  </tr>
                ) : (
                  filteredList.map((person) => {
                    const isCompleted = person.status === 'completed';
                    return (
                      <tr key={person.id} className="hover:bg-gray-50/60 transition-colors">
                        {/* 姓名与头像 */}
                        <td className="py-2.5 px-3.5">
                          <div className="flex items-center gap-2">
                            <img
                              src={person.avatar}
                              alt={person.name}
                              className="w-7 h-7 rounded-full object-cover border border-gray-200 shrink-0"
                            />
                            <div>
                              <span className="font-bold text-gray-900">{person.name}</span>
                              <span className="text-[11px] text-gray-400 font-mono ml-1.5">
                                {person.phone}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* 部门角色 */}
                        <td className="py-2.5 px-3.5">
                          <span className="text-gray-700 font-medium">{person.department}</span>
                          <span className="text-[11px] text-gray-400 ml-1.5">({person.role})</span>
                        </td>

                        {/* 换绑路线 (原号 → 新号) */}
                        <td className="py-2.5 px-3.5">
                          <div className="flex items-center gap-1 text-[11px]">
                            <span className="text-gray-500 truncate max-w-[100px]">{sourceMpName}</span>
                            <span className="material-symbols-outlined text-[13px] text-gray-400">trending_flat</span>
                            <span className="text-[#1890ff] font-semibold truncate max-w-[120px]">
                              {targetMpName}
                            </span>
                          </div>
                        </td>

                        {/* 资产 */}
                        <td className="py-2.5 px-3.5">
                          <span className="text-gray-600 text-[11px]">
                            稿件 <strong>{person.inheritedDraftsCount}</strong> 篇 · 积分 <strong>{person.inheritedPoints}</strong>
                          </span>
                        </td>

                        {/* 状态 */}
                        <td className="py-2.5 px-3.5">
                          {isCompleted ? (
                            <span className="text-[11px] font-bold text-emerald-700 inline-flex items-center gap-1 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                              <span className="material-symbols-outlined text-[13px]">check_circle</span>
                              换绑完成
                            </span>
                          ) : (
                            <div className="inline-flex items-center gap-1 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                              <span className="text-[11px] font-semibold text-amber-800 inline-flex items-center gap-0.5">
                                <span className="material-symbols-outlined text-[13px]">schedule</span>
                                待扫码绑定
                              </span>
                              {person.remindCount > 0 && (
                                <span className="text-[10px] text-amber-600 font-mono">
                                  ({person.remindCount}次)
                                </span>
                              )}
                            </div>
                          )}
                        </td>

                        {/* 操作 */}
                        <td className="py-2.5 px-3.5 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {!isCompleted ? (
                              <>
                                <button
                                  type="button"
                                  disabled={!isCustomBound}
                                  onClick={() => openConfirmModalForSingle(person)}
                                  className="text-xs font-semibold text-[#1890ff] hover:underline cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                                  title={!isCustomBound ? '请先在公众号配置中完成换绑' : '发起换绑提醒'}
                                >
                                  发送换绑
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setSelectedPersonForQr(person)}
                                  className="text-xs text-purple-600 hover:underline cursor-pointer"
                                  title="查看该人员的专属换绑码"
                                >
                                  专属码
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleManualConfirmMigration(person.id, person.name)}
                                  className="text-xs text-emerald-600 hover:underline cursor-pointer"
                                  title="管理员人工直接确认完成"
                                >
                                  人工确认
                                </button>
                              </>
                            ) : (
                              <span className="text-xs text-gray-400">已就绪</span>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* 3. 核心弹窗：迁移确认弹窗 (明确从当前公众号迁移到哪个公众号) */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 bg-black/45 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-5 animate-scale-up space-y-4 text-gray-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-[#1890ff] shrink-0">
                <span className="material-symbols-outlined text-[24px]">swap_horiz</span>
              </div>
              <div>
                <h3 className="text-base font-bold text-gray-900">确认发起人员跨号换绑迁移</h3>
                <p className="text-xs text-gray-500">
                  {confirmModalType === 'all'
                    ? `向全员 (${totalCount}人) 发送跨号换绑提醒通知`
                    : `向成员【${targetPersonToMigrate?.name}】发送跨号换绑提醒通知`}
                </p>
              </div>
            </div>

            {/* 核心明确对比：从原公众号迁移到目标公众号 */}
            <div className="bg-blue-50/70 border border-blue-200/90 rounded-xl p-3.5 space-y-2">
              <div className="text-xs text-gray-500 font-semibold mb-1">
                换绑迁移路线确认：
              </div>

              <div className="flex items-center justify-between text-xs bg-white p-2.5 rounded-lg border border-blue-100">
                <span className="text-gray-500 font-medium">从 (当前公众号)：</span>
                <span className="font-bold text-gray-800">{sourceMpName}</span>
              </div>

              <div className="flex items-center justify-center text-blue-500">
                <span className="material-symbols-outlined text-[20px]">arrow_downward</span>
              </div>

              <div className="flex items-center justify-between text-xs bg-white p-2.5 rounded-lg border border-blue-200">
                <span className="text-blue-700 font-bold">迁移至 (目标公众号)：</span>
                <span className="font-bold text-[#1890ff] text-sm">{targetMpName}</span>
              </div>
            </div>

            {/* 迁移资产与下发渠道说明 */}
            <div className="text-xs text-gray-600 bg-gray-50 p-3 rounded-lg space-y-1.5 border border-gray-200/60">
              <div className="font-bold text-gray-800 flex items-center gap-1">
                <span className="material-symbols-outlined text-[15px] text-emerald-600">verified</span>
                <span>全量资产无缝继承：</span>
              </div>
              <p>✓ 历史草稿、已发布稿件与统计积分 100% 自动结转。</p>
              <p>✓ 机构职务与审核流权限完整保留，扫码关注即可快速绑定。</p>
              <div className="text-gray-400 text-[11px] pt-1">
                通知渠道：{channelText}
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100">
              <button
                type="button"
                onClick={closeConfirmModal}
                disabled={isLaunching}
                className="px-4 py-2 rounded-lg text-xs font-medium text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
              >
                取消
              </button>
              <button
                type="button"
                onClick={handleExecuteConfirmedMigration}
                disabled={isLaunching}
                className="px-4 py-2 rounded-lg text-xs font-bold bg-[#1890ff] text-white hover:bg-blue-600 transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs"
              >
                <span className={`material-symbols-outlined text-[16px] ${isLaunching ? 'animate-spin' : ''}`}>
                  {isLaunching ? 'sync' : 'check'}
                </span>
                <span>{isLaunching ? '正在执行迁移...' : '确认开始迁移'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 专属换绑码弹窗 */}
      {selectedPersonForQr && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4 animate-fade-in">
          <div className="bg-white rounded-xl shadow-xl border border-gray-200 w-full max-w-xs p-5 text-center space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-gray-100">
              <span className="font-bold text-xs text-gray-900">
                【{selectedPersonForQr.name}】专属换绑码
              </span>
              <button
                type="button"
                onClick={() => setSelectedPersonForQr(null)}
                className="text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 inline-block">
              <div className="w-36 h-36 bg-gradient-to-br from-blue-700 to-indigo-800 rounded-lg flex flex-col items-center justify-center text-white p-2">
                <span className="material-symbols-outlined text-[44px]">qr_code_2</span>
                <span className="text-[10px] font-bold mt-1">{selectedPersonForQr.name} 专属码</span>
                <span className="text-[8px] text-blue-200">微信扫码关注【{targetMpName}】</span>
              </div>
            </div>

            <p className="text-[11px] text-gray-500">
              采编人员使用微信扫描此码关注新公众号，系统将自动关联身份并完成换绑
            </p>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => {
                  showToast(`已复制【${selectedPersonForQr.name}】专属换绑邀请短链！`);
                  setSelectedPersonForQr(null);
                }}
                className="w-full py-2 rounded-lg text-xs font-bold bg-[#1890ff] text-white hover:bg-blue-600 cursor-pointer transition-colors shadow-2xs"
              >
                复制专属换绑链接
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 迁移记录抽屉 / 弹窗 */}
      {showTaskDrawer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4 animate-fade-in">
          <div className="bg-white rounded-xl shadow-xl border border-gray-200 w-full max-w-lg p-5 space-y-3.5">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h3 className="font-bold text-xs text-gray-900 flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px] text-[#1890ff]">history</span>
                <span>人员换绑任务记录</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowTaskDrawer(false)}
                className="text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            <div className="space-y-2.5 max-h-80 overflow-y-auto">
              {tasks.map((task) => (
                <div key={task.id} className="p-3 bg-gray-50 rounded-xl border border-gray-200 text-xs space-y-1">
                  <div className="flex items-center justify-between font-bold text-gray-900">
                    <span>{task.taskName}</span>
                    <span className="text-[10px] px-2 py-0.5 bg-blue-100 text-[#1890ff] rounded-full font-medium">
                      进行中
                    </span>
                  </div>
                  <div className="text-gray-500 text-[11px]">
                    路线：{task.sourceMpName} ➔ {task.targetMpName}
                  </div>
                  <div className="text-gray-500 text-[11px]">
                    发起时间：{task.createdAt} · 经办人：{task.operator}
                  </div>
                  <div className="text-gray-500 text-[11px]">
                    进度：已完成 {task.completedCount} / 总计 {task.totalPersonnel} 人（{task.progressPercentage}%）
                  </div>
                </div>
              ))}
            </div>

            <div className="text-right pt-2 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setShowTaskDrawer(false)}
                className="px-4 py-1.5 rounded-lg text-xs font-bold bg-gray-100 hover:bg-gray-200 text-gray-700 cursor-pointer"
              >
                关闭
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
