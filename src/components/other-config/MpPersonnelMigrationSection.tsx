import React from 'react';
import {
  MpMigrationConfig,
  MpPersonnelMigrationItem,
  MpMigrationTask,
  MpMigrationStatus,
  WechatMpConfig,
} from '../../types';
import { useMpPersonnelMigrationViewModel } from '../../viewmodels/useMpPersonnelMigrationViewModel';

export const mockMigrationPersonnel: MpPersonnelMigrationItem[] = [
  {
    id: 'MIG-USER-001',
    name: '张建国',
    nickname: '建国-随州采编',
    phone: '138****6721',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80',
    department: '新闻采编部',
    role: '速报采编员',
    sourceMp: '点点速报',
    sourceOpenId: 'o4_ddsb_892301984210a',
    targetMp: '随州融媒发布',
    targetOpenId: 'oZ4_szrm_781209384112b',
    status: 'completed',
    matchedVia: 'union_id',
    migratedTime: '2026-08-28 14:22:10',
    remindCount: 1,
    inheritedRoles: ['速报采编员', '初审编辑'],
    inheritedDraftsCount: 18,
    inheritedPoints: 120,
    lastRemindTime: '2026-08-28 10:00:00',
  },
  {
    id: 'MIG-USER-002',
    name: '李丽华',
    nickname: '丽华-随州融媒',
    phone: '139****1823',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80',
    department: '新媒体运营中心',
    role: '机构管理员',
    sourceMp: '点点速报',
    sourceOpenId: 'o4_ddsb_119283471029c',
    targetMp: '随州融媒发布',
    targetOpenId: 'oZ4_szrm_992182736154k',
    status: 'completed',
    matchedVia: 'wechat_template_card',
    migratedTime: '2026-08-28 15:40:02',
    remindCount: 1,
    inheritedRoles: ['机构超级管理员', '终审发稿'],
    inheritedDraftsCount: 42,
    inheritedPoints: 350,
    lastRemindTime: '2026-08-28 10:00:00',
  },
  {
    id: 'MIG-USER-003',
    name: '王小伟',
    nickname: '小伟摄影',
    phone: '137****5612',
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100&auto=format&fit=crop&q=80',
    department: '影像摄制组',
    role: '速报采编员',
    sourceMp: '点点速报',
    sourceOpenId: 'o4_ddsb_551920384712d',
    targetMp: '随州融媒发布',
    targetOpenId: '',
    status: 'pending_scan',
    matchedVia: 'qr_scan',
    remindCount: 2,
    inheritedRoles: ['现场快报员'],
    inheritedDraftsCount: 7,
    inheritedPoints: 45,
    lastRemindTime: '2026-08-29 09:30:00',
  },
  {
    id: 'MIG-USER-004',
    name: '赵子涵',
    nickname: '子涵-热线跟进',
    phone: '136****9928',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&auto=format&fit=crop&q=80',
    department: '舆情监测科',
    role: '舆情监测员',
    sourceMp: '点点速报',
    sourceOpenId: 'o4_ddsb_772819034812f',
    targetMp: '随州融媒发布',
    targetOpenId: 'oZ4_szrm_331928471920m',
    status: 'completed',
    matchedVia: 'union_id',
    migratedTime: '2026-08-28 16:10:45',
    remindCount: 1,
    inheritedRoles: ['舆情快报审发'],
    inheritedDraftsCount: 29,
    inheritedPoints: 210,
    lastRemindTime: '2026-08-28 10:00:00',
  },
  {
    id: 'MIG-USER-005',
    name: '刘志强',
    nickname: '志强-应急报送',
    phone: '135****4419',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
    department: '应急联动中心',
    role: '速报采编员',
    sourceMp: '点点速报',
    sourceOpenId: 'o4_ddsb_991823746192e',
    targetMp: '随州融媒发布',
    targetOpenId: '',
    status: 'pending_scan',
    matchedVia: 'sms_invite',
    remindCount: 3,
    inheritedRoles: ['应急速报员'],
    inheritedDraftsCount: 12,
    inheritedPoints: 95,
    lastRemindTime: '2026-08-30 08:15:00',
  },
  {
    id: 'MIG-USER-006',
    name: '陈敏',
    nickname: '敏敏-政务播报',
    phone: '133****8871',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
    department: '政务新闻部',
    role: '普通成员',
    sourceMp: '点点速报',
    sourceOpenId: 'o4_ddsb_662819203817h',
    targetMp: '随州融媒发布',
    targetOpenId: '',
    status: 'not_started',
    matchedVia: 'manual',
    remindCount: 0,
    inheritedRoles: ['普通成员'],
    inheritedDraftsCount: 0,
    inheritedPoints: 15,
    lastRemindTime: '2026-08-28 10:00:00',
  },
];

export const mockMigrationTasks: MpMigrationTask[] = [
  {
    id: 'TASK-MIG-20260828',
    taskBatchNo: 'BATCH-20260828-01',
    taskName: '随州市网信中心全员换绑任务（点点速报 -> 随州融媒发布）',
    sourceMpName: '点点速报 (平台统配)',
    targetMpName: '随州融媒发布 (官方服务号)',
    totalPersonnel: 6,
    completedCount: 3,
    pendingCount: 2,
    failedCount: 1,
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
}

export const MpPersonnelMigrationSection: React.FC<MpPersonnelMigrationSectionProps> = ({
  institutionName,
  mpConfig,
  migrationConfig,
  onChangeMigration,
  showToast,
}) => {
  const { state, actions } = useMpPersonnelMigrationViewModel({
    institutionName,
    mpConfig,
    migrationConfig,
    defaultPersonnel: mockMigrationPersonnel,
    defaultTasks: mockMigrationTasks,
    onChangeMigration,
    showToast,
  });
  const {
    personnelList,
    tasks,
    searchQuery,
    statusFilter,
    showTaskDrawer,
    showPrincipleHelp,
    showLaunchModal,
    isLaunching,
    selectedPersonForQr,
    targetMpName,
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
    setShowLaunchModal,
    setSelectedPersonForQr,
    handleRemindPerson,
    handleManualConfirmMigration,
    handleLaunchMigrationTask,
  } = actions;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-2xs space-y-4 text-gray-800">
      {/* 1. 顶部标题与主要操作 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3.5 border-b border-gray-100">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-gray-900">人员一键换绑迁移</h3>
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-blue-50 text-[#1890ff] font-medium border border-blue-200">
              点点速报 → {targetMpName}
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-0.5">
            机构切换公众号后，可向采编人员下发换绑提醒，扫码即可绑定新公众号，历史稿件、积分与权限全量保留
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowLaunchModal(true)}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#1890ff] text-white hover:bg-blue-600 shadow-2xs transition-colors flex items-center gap-1 cursor-pointer whitespace-nowrap"
          >
            <span className="material-symbols-outlined text-[15px]">send</span>
            <span>发起全员迁移</span>
          </button>

          <button
            type="button"
            onClick={() => {
              showToast(`已向待换绑的成员发送${channelText}催办提醒！`, 'success');
            }}
            className="px-2.5 py-1.5 rounded-lg text-xs font-medium bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200 transition-colors flex items-center gap-1 cursor-pointer whitespace-nowrap"
          >
            <span className="material-symbols-outlined text-[15px]">notifications_active</span>
            <span>一键催办 ({pendingCount})</span>
          </button>

          <button
            type="button"
            onClick={() => setShowTaskDrawer(true)}
            className="px-2 py-1.5 rounded-lg text-xs font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100 transition-colors flex items-center gap-0.5 cursor-pointer"
            title="查看历史换绑下发记录"
          >
            <span className="material-symbols-outlined text-[16px]">history</span>
            <span>记录 ({tasks.length})</span>
          </button>
        </div>
      </div>

      {/* 2. 紧凑集成式进度状态条 */}
      <div className="p-3 rounded-xl bg-gray-50/80 border border-gray-200/80 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-3 sm:gap-5">
          <div className="flex items-center gap-2">
            <span className="font-medium text-gray-700">迁移总进度</span>
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
          <span>{showPrincipleHelp ? '收起换绑说明' : '换绑操作指引'}</span>
        </button>
      </div>

      {/* 展开的换绑说明 */}
      {showPrincipleHelp && (
        <div className="p-3 rounded-lg bg-blue-50/50 border border-blue-100 text-xs space-y-1.5 text-gray-600 animate-fade-in">
          <div className="font-semibold text-blue-900 flex items-center gap-1">
            <span className="material-symbols-outlined text-[15px] text-[#1890ff]">check_circle</span>
            <span>换绑流程说明：</span>
          </div>
          <ol className="list-decimal pl-4 space-y-0.5 text-gray-600 text-[11px] leading-relaxed">
            <li>管理员点击「发起全员迁移」后，系统自动向采编员的微信和手机发送换绑通知；</li>
            <li>采编员扫描新公众号二维码关注，系统自动完成身份关联，历史发稿与积分 100% 继承；</li>
            <li>个别人员如未收到通知，可点击其右侧「专属码」单独发送，或由管理员点击「人工确认」。</li>
          </ol>
        </div>
      )}

      {/* 3. 筛选与人员列表 */}
      <div className="space-y-3 pt-1">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          {/* 状态筛选 Tabs */}
          <div className="flex items-center bg-gray-100/80 p-0.5 rounded-lg text-xs">
            <button
              type="button"
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1 rounded-md font-medium cursor-pointer transition-all ${
                statusFilter === 'all' ? 'bg-white text-gray-900 shadow-2xs font-semibold' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              全部 ({totalCount})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter('pending_scan')}
              className={`px-3 py-1 rounded-md font-medium cursor-pointer transition-all ${
                statusFilter === 'pending_scan' ? 'bg-white text-amber-700 shadow-2xs font-semibold' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              待换绑 ({pendingCount})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter('completed')}
              className={`px-3 py-1 rounded-md font-medium cursor-pointer transition-all ${
                statusFilter === 'completed' ? 'bg-white text-emerald-700 shadow-2xs font-semibold' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              已完成 ({completedCount})
            </button>
          </div>

          {/* 搜索 */}
          <div className="relative">
            <span className="material-symbols-outlined absolute left-2.5 top-1.5 text-gray-400 text-[14px]">
              search
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="搜索姓名或手机号..."
              className="pl-7 pr-2.5 py-1 text-xs bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:outline-none focus:border-[#1890ff] w-48"
            />
          </div>
        </div>

        {/* 简洁表格 */}
        <div className="border border-gray-200/90 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs min-w-[650px]">
              <thead className="bg-gray-50/80 border-b border-gray-200 text-gray-500 font-medium select-none">
                <tr>
                  <th className="py-2 px-3.5">采编人员</th>
                  <th className="py-2 px-3.5">部门与角色</th>
                  <th className="py-2 px-3.5">继承资产</th>
                  <th className="py-2 px-3.5">换绑状态</th>
                  <th className="py-2 px-3.5 text-right">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-gray-700">
                {filteredList.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-6 text-center text-gray-400">
                      未找到匹配人员
                    </td>
                  </tr>
                ) : (
                  filteredList.map((person) => {
                    const isCompleted = person.status === 'completed';
                    return (
                      <tr key={person.id} className="hover:bg-gray-50/50 transition-colors">
                        {/* 姓名与头像 */}
                        <td className="py-2.5 px-3.5">
                          <div className="flex items-center gap-2">
                            <img
                              src={person.avatar}
                              alt={person.name}
                              className="w-6 h-6 rounded-full object-cover border border-gray-200 shrink-0"
                            />
                            <div>
                              <span className="font-semibold text-gray-900">{person.name}</span>
                              <span className="text-[11px] text-gray-400 font-mono ml-1.5">{person.phone}</span>
                            </div>
                          </div>
                        </td>

                        {/* 部门角色 */}
                        <td className="py-2.5 px-3.5">
                          <span className="text-gray-700">{person.department}</span>
                          <span className="text-[11px] text-gray-400 ml-1.5">({person.role})</span>
                        </td>

                        {/* 资产 */}
                        <td className="py-2.5 px-3.5">
                          <span className="text-gray-600">
                            稿件 <strong>{person.inheritedDraftsCount}</strong> 篇 · 积分 <strong>{person.inheritedPoints}</strong>
                          </span>
                        </td>

                        {/* 状态 */}
                        <td className="py-2.5 px-3.5">
                          {isCompleted ? (
                            <span className="text-[11px] font-medium text-emerald-700 inline-flex items-center gap-1">
                              <span className="material-symbols-outlined text-[14px]">check_circle</span>
                              已就绪
                            </span>
                          ) : (
                            <div className="inline-flex items-center gap-1">
                              <span className="text-[11px] font-medium text-amber-700 inline-flex items-center gap-0.5">
                                <span className="material-symbols-outlined text-[13px]">schedule</span>
                                待换绑
                              </span>
                              {person.remindCount > 0 && (
                                <span className="text-[10px] text-gray-400">
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
                                  onClick={() => handleRemindPerson(person.id, person.name)}
                                  className="text-[11px] text-[#1890ff] hover:underline cursor-pointer"
                                >
                                  催办
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setSelectedPersonForQr(person)}
                                  className="text-[11px] text-purple-600 hover:underline cursor-pointer"
                                >
                                  专属码
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleManualConfirmMigration(person.id, person.name)}
                                  className="text-[11px] text-emerald-600 hover:underline cursor-pointer"
                                >
                                  人工确认
                                </button>
                              </>
                            ) : (
                              <span className="text-[11px] text-gray-400">无需操作</span>
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

      {/* Task Log Drawer / Modal */}
      {showTaskDrawer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 w-full max-w-lg overflow-hidden animate-scale-in p-5">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-3">
              <h3 className="font-bold text-xs text-gray-900 flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px] text-[#1890ff]">history</span>
                <span>换绑任务下发记录</span>
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
                <div key={task.id} className="p-3 bg-gray-50 rounded-xl border border-gray-200 text-xs">
                  <div className="flex items-center justify-between font-bold text-gray-900 mb-1">
                    <span>{task.taskName}</span>
                    <span className="text-[10px] px-1.5 py-0.2 bg-blue-100 text-[#1890ff] rounded">
                      进行中
                    </span>
                  </div>
                  <div className="text-gray-500 text-[11px]">
                    发起时间：{task.createdAt} · 经办人：{task.operator}
                  </div>
                  <div className="text-gray-500 text-[11px] mt-1">
                    迁移进度：已完成 {task.completedCount} / 总计 {task.totalPersonnel} 人（{task.progressPercentage}%）
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 text-right">
              <button
                type="button"
                onClick={() => setShowTaskDrawer(false)}
                className="px-4 py-1.5 rounded-xl text-xs font-bold bg-gray-100 hover:bg-gray-200 text-gray-700 cursor-pointer"
              >
                关闭
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal 1: Launch Batch Migration Modal */}
      {showLaunchModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 w-full max-w-md overflow-hidden animate-scale-in">
            <div className="px-5 py-3.5 bg-[#1890ff] text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[20px]">swap_horiz</span>
                <span className="font-bold text-sm">发起全员一键换绑</span>
              </div>
              <button
                type="button"
                onClick={() => setShowLaunchModal(false)}
                className="text-white/80 hover:text-white cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            <form onSubmit={handleLaunchMigrationTask} className="p-5 space-y-3.5 text-xs">
              <div className="p-3 bg-blue-50 rounded-xl border border-blue-100 text-gray-700 space-y-1">
                <div className="font-bold text-blue-900">迁移路径：点点速报 → {targetMpName}</div>
                <div className="text-gray-600">
                  系统将按平台全局参数向全员 <strong>{totalCount}</strong> 位采编人员发送
                  <strong>{channelText}</strong>。
                </div>
              </div>

              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100 text-emerald-800 text-xs">
                ✓ 历史发稿记录、积分与权限将 100% 自动继承保留，无需重复开通。
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowLaunchModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-gray-100 hover:bg-gray-200 text-gray-700 cursor-pointer"
                >
                  取消
                </button>
                <button
                  type="submit"
                  disabled={isLaunching}
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-[#1890ff] text-white hover:bg-blue-600 cursor-pointer flex items-center gap-1 disabled:opacity-50"
                >
                  <span className="material-symbols-outlined text-[16px]">{isLaunching ? 'sync' : 'send'}</span>
                  <span>{isLaunching ? '正在下发...' : '确认立即下发'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Individual QR Modal */}
      {selectedPersonForQr && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 w-full max-w-xs overflow-hidden animate-scale-in p-5 text-center">
            <div className="flex items-center justify-between pb-2.5 border-b border-gray-100 mb-3">
              <span className="font-bold text-xs text-gray-900">【{selectedPersonForQr.name}】专属换绑码</span>
              <button
                type="button"
                onClick={() => setSelectedPersonForQr(null)}
                className="text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 inline-block mb-2">
              <div className="w-36 h-36 bg-gradient-to-br from-indigo-900 to-purple-900 rounded-lg flex flex-col items-center justify-center text-white p-2">
                <span className="material-symbols-outlined text-[40px]">qr_code_2</span>
                <span className="text-[10px] font-bold mt-1">{selectedPersonForQr.name} 专属码</span>
                <span className="text-[8px] text-purple-200">扫码直接绑定新公众号</span>
              </div>
            </div>

            <p className="text-[11px] text-gray-500">
              请将此码微信发送给该人员，扫码后将自动完成换绑
            </p>

            <div className="mt-3 flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => {
                  showToast(`已复制【${selectedPersonForQr.name}】专属换绑短链！`);
                  setSelectedPersonForQr(null);
                }}
                className="px-3 py-1.5 rounded-xl text-xs font-bold bg-[#1890ff] text-white hover:bg-blue-600 cursor-pointer"
              >
                复制换绑短链
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
