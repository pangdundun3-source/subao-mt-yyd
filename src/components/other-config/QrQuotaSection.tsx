import React from 'react';
import {
  Institution,
  QrQuotaAddRecord,
  QrCodeUsageConfig,
} from '../../types';
import { useQrQuotaViewModel } from '../../viewmodels/useQrQuotaViewModel';

export const defaultQuotaHistory: QrQuotaAddRecord[] = [
  {
    id: 'REC-20260827-01',
    addAmount: 20,
    previousLimit: 30,
    newLimit: 50,
    reason: '曾都区、广水市网信采编通讯员团队扩容入驻',
    operator: '系统超级管理员 (李主任)',
    createdAt: '2026-08-25 14:30:22',
  },
  {
    id: 'REC-20260810-02',
    addAmount: 10,
    previousLimit: 20,
    newLimit: 30,
    reason: '随县融媒体中心新增应急速报网格员',
    operator: '机构管理员 (周建军)',
    createdAt: '2026-08-10 09:15:40',
  },
  {
    id: 'REC-20260701-03',
    addAmount: 20,
    previousLimit: 0,
    newLimit: 20,
    reason: '机构初始开通随州速报体系标准基础配额',
    operator: '平台开通专员 (张工)',
    createdAt: '2026-07-01 10:00:00',
  },
];

export interface BoundPersonnel {
  id: string;
  name: string;
  department: string;
  role: string;
  phone: string;
  bindTime: string;
  status: 'active' | 'suspended';
}

export const mockBoundPersonnelList: BoundPersonnel[] = [
  { id: 'U001', name: '王俊杰', department: '网信综合科', role: '首席采编员', phone: '138****5621', bindTime: '2026-08-26 16:42:10', status: 'active' },
  { id: 'U002', name: '刘晓丽', department: '曾都区融媒体中心', role: '应急速报员', phone: '139****8832', bindTime: '2026-08-26 14:15:05', status: 'active' },
  { id: 'U003', name: '张建国', department: '广水市网信办', role: '网格通讯员', phone: '137****9012', bindTime: '2026-08-25 11:30:40', status: 'active' },
  { id: 'U004', name: '陈思齐', department: '随县宣传报道组', role: '网格速报员', phone: '135****4423', bindTime: '2026-08-24 09:20:18', status: 'active' },
  { id: 'U005', name: '黄海波', department: '高新区网信网格', role: '采编干事', phone: '186****7719', bindTime: '2026-08-23 17:05:52', status: 'active' },
  { id: 'U006', name: '李梦瑶', department: '舆情监测指挥中心', role: '值班分析员', phone: '150****2234', bindTime: '2026-08-22 10:48:33', status: 'active' },
  { id: 'U007', name: '赵宏图', department: '大洪山管委会采编室', role: '通讯特派员', phone: '188****6651', bindTime: '2026-08-21 15:33:12', status: 'active' },
  { id: 'U008', name: '周婷婷', department: '融媒体政务分发部', role: '编辑记者', phone: '136****9910', bindTime: '2026-08-20 08:45:20', status: 'active' },
];

interface QrQuotaSectionProps {
  institution?: Institution | null;
  qrConfig?: QrCodeUsageConfig;
  onChangeQrConfig: (config: QrCodeUsageConfig) => void;
  showToast: (msg: string, type?: 'success' | 'warning' | 'info') => void;
}

export const QrQuotaSection: React.FC<QrQuotaSectionProps> = ({
  institution,
  qrConfig,
  onChangeQrConfig,
  showToast,
}) => {
  const { state, actions } = useQrQuotaViewModel({
    institution,
    qrConfig,
    defaultHistory: defaultQuotaHistory,
    defaultPersonnel: mockBoundPersonnelList,
    onChangeQrConfig,
    showToast,
  });
  const {
    totalLimit,
    usedCount,
    history,
    activeSubTab,
    personnelSearch,
    boundPersonnel,
    showAddModal,
    addAmount,
    addReason,
    operatorName,
    remainingCount,
    usagePercentage,
    filteredPersonnel,
  } = state;
  const {
    setActiveSubTab,
    setPersonnelSearch,
    setShowAddModal,
    setAddAmount,
    setAddReason,
    setOperatorName,
    handleUnbindPersonnel,
    handleConfirmAddQuota,
  } = actions;

  return (
    <div className="space-y-6 animate-fade-in text-gray-800">
      {/* 1. Header Overview & Stats Cards */}
      <div className="bg-white rounded-2xl border border-gray-200/90 p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-gray-100">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 flex items-center justify-center text-[#1890ff] shadow-2xs">
              <span className="material-symbols-outlined text-[24px]">qr_code_2</span>
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h3 className="text-base font-bold text-gray-900">二维码使用名额与额度管理</h3>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-50 text-[#1890ff] border border-blue-200 font-semibold">
                  机构专享名额库
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-0.5">
                管理【{institution?.name || '当前机构'}】的采编入驻与关注二维码总额度、已占用人数及动态增发台账
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2.5 rounded-xl text-xs font-bold bg-[#1890ff] text-white hover:bg-blue-600 shadow-xs hover:shadow-md transition-all flex items-center gap-1.5 cursor-pointer self-start md:self-auto"
          >
            <span className="material-symbols-outlined text-[16px]">add_circle</span>
            <span>增加二维码名额</span>
          </button>
        </div>

        {/* Dynamic Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mt-5">
          {/* Card 1: Total Limit */}
          <div className="bg-gray-50/80 p-4 rounded-xl border border-gray-200/80">
            <div className="text-xs text-gray-500 font-medium flex items-center justify-between">
              <span>二维码总名额</span>
              <span className="material-symbols-outlined text-[18px] text-gray-400">confirmation_number</span>
            </div>
            <div className="text-2xl font-black font-mono text-gray-900 mt-1.5">
              {totalLimit} <span className="text-xs font-normal text-gray-500">个</span>
            </div>
            <div className="text-[11px] text-gray-400 mt-1">
              累计核定最高支持扫码激活数
            </div>
          </div>

          {/* Card 2: Used Count */}
          <div className="bg-blue-50/70 p-4 rounded-xl border border-blue-200/70">
            <div className="text-xs text-blue-800 font-medium flex items-center justify-between">
              <span>已绑定占用</span>
              <span className="material-symbols-outlined text-[18px] text-[#1890ff]">how_to_reg</span>
            </div>
            <div className="text-2xl font-black font-mono text-[#1890ff] mt-1.5">
              {usedCount} <span className="text-xs font-normal text-blue-600">人</span>
            </div>
            <div className="text-[11px] text-blue-600 mt-1">
              已扫码激活并关联微信账号
            </div>
          </div>

          {/* Card 3: Remaining */}
          <div className="bg-emerald-50/70 p-4 rounded-xl border border-emerald-200/70">
            <div className="text-xs text-emerald-800 font-medium flex items-center justify-between">
              <span>剩余可用配额</span>
              <span className="material-symbols-outlined text-[18px] text-emerald-600">check_circle</span>
            </div>
            <div className="text-2xl font-black font-mono text-emerald-700 mt-1.5">
              {remainingCount} <span className="text-xs font-normal text-emerald-600">个</span>
            </div>
            <div className="text-[11px] text-emerald-600 mt-1">
              {remainingCount <= 5 ? '配额紧张，建议及时申请增发' : '名额充裕，可继续分发'}
            </div>
          </div>

          {/* Card 4: Usage Percentage */}
          <div className="bg-purple-50/70 p-4 rounded-xl border border-purple-200/70 flex flex-col justify-between">
            <div>
              <div className="text-xs text-purple-800 font-medium flex items-center justify-between">
                <span>名额使用率</span>
                <span className="text-xs font-black font-mono text-purple-700">{usagePercentage}%</span>
              </div>
              <div className="w-full bg-purple-100 rounded-full h-2.5 mt-2.5 overflow-hidden">
                <div
                  className="bg-purple-600 h-full rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, Number(usagePercentage))}%` }}
                />
              </div>
            </div>
            <div className="text-[11px] text-purple-700 mt-2 font-medium">
              占用比例正常
            </div>
          </div>
        </div>
      </div>

      {/* 2. Sub-Tabs Section */}
      <div className="bg-white rounded-2xl border border-gray-200/90 p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-100">
          <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-xl w-fit">
            <button
              type="button"
              onClick={() => setActiveSubTab('records')}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeSubTab === 'records'
                  ? 'bg-white text-gray-900 shadow-xs'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">receipt_long</span>
              <span>名额调整与增发记录</span>
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-blue-50 text-[#1890ff] font-mono">
                {history.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveSubTab('personnel')}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeSubTab === 'personnel'
                  ? 'bg-white text-gray-900 shadow-xs'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">person_check</span>
              <span>已绑定人员名单</span>
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-gray-200 text-gray-700 font-mono">
                {boundPersonnel.length}
              </span>
            </button>
          </div>

          {activeSubTab === 'personnel' && (
            <div className="relative">
              <span className="material-symbols-outlined absolute left-2.5 top-2 text-gray-400 text-[16px]">
                search
              </span>
              <input
                type="text"
                value={personnelSearch}
                onChange={(e) => setPersonnelSearch(e.target.value)}
                placeholder="搜索姓名、科室、角色或手机号..."
                className="pl-8 pr-3 py-1.5 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:border-[#1890ff] w-64"
              />
            </div>
          )}
        </div>

        {/* Tab Content: Records */}
        {activeSubTab === 'records' && (
          <div className="border border-gray-200 rounded-xl overflow-hidden shadow-2xs">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 border-b border-gray-200 text-gray-600 font-bold select-none">
                <tr>
                  <th className="py-3 px-4">流水单号</th>
                  <th className="py-3 px-4">增发额度</th>
                  <th className="py-3 px-4">变更前 → 变更后总数</th>
                  <th className="py-3 px-4">调整事由</th>
                  <th className="py-3 px-4">经办人</th>
                  <th className="py-3 px-4 text-right">经办时间</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-gray-700">
                {history.map((record) => (
                  <tr key={record.id} className="hover:bg-gray-50/60 transition-colors">
                    <td className="py-3 px-4 font-mono text-gray-500 font-medium">{record.id}</td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 font-mono">
                        +{record.addAmount}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono text-xs">
                      <span className="text-gray-500">{record.previousLimit}</span>
                      <span className="text-gray-400 mx-1.5">→</span>
                      <span className="font-bold text-[#1890ff]">{record.newLimit} 个</span>
                    </td>
                    <td className="py-3 px-4 max-w-xs text-gray-800 truncate" title={record.reason}>
                      {record.reason}
                    </td>
                    <td className="py-3 px-4 text-gray-700">{record.operator}</td>
                    <td className="py-3 px-4 text-right text-gray-400 font-mono text-[11px]">
                      {record.createdAt}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Tab Content: Bound Personnel */}
        {activeSubTab === 'personnel' && (
          <div className="border border-gray-200 rounded-xl overflow-hidden shadow-2xs">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 border-b border-gray-200 text-gray-600 font-bold select-none">
                <tr>
                  <th className="py-3 px-4">姓名</th>
                  <th className="py-3 px-4">所属部门 / 科室</th>
                  <th className="py-3 px-4">角色身份</th>
                  <th className="py-3 px-4">联系手机</th>
                  <th className="py-3 px-4">扫码激活时间</th>
                  <th className="py-3 px-4 text-right">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-gray-700">
                {filteredPersonnel.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-gray-400">
                      暂无已绑定的在岗人员记录
                    </td>
                  </tr>
                ) : (
                  filteredPersonnel.map((person) => (
                    <tr key={person.id} className="hover:bg-gray-50/60 transition-colors">
                      <td className="py-3 px-4 font-bold text-gray-900 flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-blue-100 text-[#1890ff] flex items-center justify-center text-[10px] font-bold">
                          {person.name.slice(0, 1)}
                        </div>
                        <span>{person.name}</span>
                      </td>
                      <td className="py-3 px-4 text-gray-800">{person.department}</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded bg-blue-50 text-[#1890ff] font-semibold text-[11px] border border-blue-100">
                          {person.role}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-mono text-gray-600">{person.phone}</td>
                      <td className="py-3 px-4 font-mono text-gray-400 text-[11px]">{person.bindTime}</td>
                      <td className="py-3 px-4 text-right">
                        <button
                          type="button"
                          onClick={() => handleUnbindPersonnel(person.id, person.name)}
                          className="text-xs text-rose-600 hover:text-rose-700 font-semibold cursor-pointer"
                        >
                          解绑并释放名额
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Quota Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 w-full max-w-md overflow-hidden animate-scale-in">
            <div className="px-6 py-4 bg-gradient-to-r from-[#1890ff] to-blue-600 text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
                  <span className="material-symbols-outlined text-[20px]">add_circle</span>
                </div>
                <div>
                  <h3 className="text-base font-bold">增加二维码使用名额</h3>
                  <p className="text-[11px] text-white/80">为当前机构增补扫码入驻与在册名额</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="text-white/80 hover:text-white cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <form onSubmit={handleConfirmAddQuota} className="p-6 space-y-4 text-xs">
              <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 flex items-center justify-between">
                <div>
                  <span className="text-gray-500">当前总额度</span>
                  <div className="text-base font-black font-mono text-gray-900">{totalLimit} 个</div>
                </div>
                <div className="text-gray-400 font-bold">+</div>
                <div>
                  <span className="text-gray-500">本次增发</span>
                  <div className="text-base font-black font-mono text-emerald-600">+{addAmount} 个</div>
                </div>
                <div className="text-gray-400 font-bold">=</div>
                <div>
                  <span className="text-gray-500">调整后总额度</span>
                  <div className="text-base font-black font-mono text-[#1890ff]">{totalLimit + (Number(addAmount) || 0)} 个</div>
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">
                  增发名额数量 (个) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="number"
                  min={1}
                  max={500}
                  required
                  value={addAmount}
                  onChange={(e) => setAddAmount(Number(e.target.value))}
                  className="w-full border border-gray-300 rounded-xl px-3 py-2 text-xs font-mono font-bold text-gray-900 focus:outline-none focus:border-[#1890ff]"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">
                  经办人姓名 / 操作账号 <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={operatorName}
                  onChange={(e) => setOperatorName(e.target.value)}
                  className="w-full border border-gray-300 rounded-xl px-3 py-2 text-xs text-gray-900 focus:outline-none focus:border-[#1890ff]"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">
                  增发事由 / 扩容审批批复 <span className="text-rose-500">*</span>
                </label>
                <textarea
                  required
                  rows={3}
                  value={addReason}
                  onChange={(e) => setAddReason(e.target.value)}
                  className="w-full border border-gray-300 rounded-xl px-3 py-2 text-xs text-gray-900 focus:outline-none focus:border-[#1890ff]"
                  placeholder="请输入增发原因，例如：下辖新增科室采编队伍扩容入驻..."
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 cursor-pointer"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-[#1890ff] text-white hover:bg-blue-600 shadow-xs cursor-pointer"
                >
                  确认增发名额
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
