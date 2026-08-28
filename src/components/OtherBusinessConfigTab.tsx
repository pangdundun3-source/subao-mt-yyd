import React, { useState, useMemo } from 'react';
import {
  Institution,
  InstitutionBusinessRules,
  OtherBusinessConfig,
  QrQuotaAddRecord,
} from '../types';

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

interface BoundPersonnel {
  id: string;
  name: string;
  department: string;
  role: string;
  phone: string;
  bindTime: string;
  status: 'active' | 'suspended';
}

const mockBoundPersonnelList: BoundPersonnel[] = [
  { id: 'U001', name: '王俊杰', department: '网信综合科', role: '首席采编员', phone: '138****5621', bindTime: '2026-08-26 16:42:10', status: 'active' },
  { id: 'U002', name: '刘晓丽', department: '曾都区融媒体中心', role: '应急速报员', phone: '139****8832', bindTime: '2026-08-26 14:15:05', status: 'active' },
  { id: 'U003', name: '张建国', department: '广水市网信办', role: '网格通讯员', phone: '137****9012', bindTime: '2026-08-25 11:30:40', status: 'active' },
  { id: 'U004', name: '陈思齐', department: '随县宣传报道组', role: '网格速报员', phone: '135****4423', bindTime: '2026-08-24 09:20:18', status: 'active' },
  { id: 'U005', name: '黄海波', department: '高新区网信网格', role: '采编干事', phone: '186****7719', bindTime: '2026-08-23 17:05:52', status: 'active' },
  { id: 'U006', name: '李梦瑶', department: '舆情监测指挥中心', role: '值班分析员', phone: '150****2234', bindTime: '2026-08-22 10:48:33', status: 'active' },
  { id: 'U007', name: '赵宏图', department: '大洪山管委会采编室', role: '通讯特派员', phone: '188****6651', bindTime: '2026-08-21 15:33:12', status: 'active' },
  { id: 'U008', name: '周婷婷', department: '融媒体政务分发部', role: '编辑记者', phone: '136****9910', bindTime: '2026-08-20 08:45:20', status: 'active' },
];

export const defaultOtherBusinessConfig: OtherBusinessConfig = {
  qrUsage: {
    totalLimit: 50,
    usedCount: 18,
    warningThreshold: 10,
    allowSelfApply: true,
    historyRecords: defaultQuotaHistory,
  },
};

interface OtherBusinessConfigTabProps {
  institution?: Institution | null;
  rules: InstitutionBusinessRules;
  setRules: React.Dispatch<React.SetStateAction<InstitutionBusinessRules>>;
  onSaveRules: (rules: InstitutionBusinessRules) => void;
  showToast: (msg: string, type?: 'success' | 'warning' | 'info') => void;
}

export const OtherBusinessConfigTab: React.FC<OtherBusinessConfigTabProps> = ({
  institution,
  rules,
  setRules,
  onSaveRules,
  showToast,
}) => {
  const currentConfig = rules.otherConfig?.qrUsage || defaultOtherBusinessConfig.qrUsage;

  const [totalLimit, setTotalLimit] = useState<number>(currentConfig.totalLimit ?? 50);
  const [usedCount, setUsedCount] = useState<number>(currentConfig.usedCount ?? 18);
  const [history, setHistory] = useState<QrQuotaAddRecord[]>(
    currentConfig.historyRecords && currentConfig.historyRecords.length > 0
      ? currentConfig.historyRecords
      : defaultQuotaHistory
  );

  const [activeSubTab, setActiveSubTab] = useState<'records' | 'personnel'>('records');
  const [personnelSearch, setPersonnelSearch] = useState<string>('');
  const [boundPersonnel, setBoundPersonnel] = useState<BoundPersonnel[]>(mockBoundPersonnelList);

  // Modal for adding quota
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [addAmount, setAddAmount] = useState<number>(20);
  const [addReason, setAddReason] = useState<string>('机构采编队伍扩充及下辖网格通讯员扫码入驻');
  const [operatorName, setOperatorName] = useState<string>('系统管理员');

  // Usage calculations
  const remainingCount = Math.max(0, totalLimit - usedCount);
  const usagePercentage =
    totalLimit > 0 ? (Math.round((usedCount / totalLimit) * 1000) / 10).toFixed(1) : '0.0';

  // Filtered personnel
  const filteredPersonnel = useMemo(() => {
    if (!personnelSearch.trim()) return boundPersonnel;
    const q = personnelSearch.toLowerCase();
    return boundPersonnel.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.department.toLowerCase().includes(q) ||
        p.role.toLowerCase().includes(q) ||
        p.phone.includes(q)
    );
  }, [boundPersonnel, personnelSearch]);

  // Handle Unbinding a personnel to release quota
  const handleUnbindPersonnel = (id: string, name: string) => {
    setBoundPersonnel((prev) => prev.filter((p) => p.id !== id));
    setUsedCount((prev) => Math.max(0, prev - 1));
    showToast(`已成功解绑人员【${name}】，二维码使用名额已释放 +1`, 'success');
  };

  // Handle Add Quota Submission
  const handleConfirmAddQuota = (e: React.FormEvent) => {
    e.preventDefault();
    if (addAmount <= 0) {
      showToast('请输入有效的增加额度数量（必须大于0）', 'warning');
      return;
    }

    const previousLimit = totalLimit;
    const newTotal = previousLimit + addAmount;

    const newRecord: QrQuotaAddRecord = {
      id: `REC-${Date.now().toString().slice(-8)}`,
      addAmount,
      previousLimit,
      newLimit: newTotal,
      reason: addReason.trim() || '机构日常扩容分配',
      operator: operatorName.trim() || '系统管理员',
      createdAt: new Date().toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      }).replace(/\//g, '-'),
    };

    const updatedHistory = [newRecord, ...history];
    setTotalLimit(newTotal);
    setHistory(updatedHistory);

    const updatedRules: InstitutionBusinessRules = {
      ...rules,
      otherConfig: {
        qrUsage: {
          totalLimit: newTotal,
          usedCount,
          warningThreshold: 10,
          allowSelfApply: true,
          historyRecords: updatedHistory,
        },
      },
    };

    setRules(updatedRules);
    onSaveRules(updatedRules);
    setShowAddModal(false);
    showToast(`已成功为当前机构增加 ${addAmount} 个二维码使用额度！总额度更新为 ${newTotal} 个`, 'success');
  };

  const instName = institution?.name || '随州市网信中心';

  return (
    <div className="space-y-5 animate-fade-in text-gray-800">
      {/* 1. Header Banner & Actions */}
      <div className="bg-white rounded-2xl border border-gray-200/90 p-5 shadow-xs transition-all">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-gray-100">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-indigo-50 to-blue-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shadow-2xs">
              <span className="material-symbols-outlined text-[24px]">tune</span>
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h3 className="text-base font-bold text-gray-900 tracking-tight">其他配置</h3>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200/70 font-semibold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
                  二维码名额管理
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-0.5">
                实时监控【{instName}】二维码入驻名额使用进度、扫码绑定人员明细及增额历史记录
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 self-start md:self-auto">
            <button
              type="button"
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#1677ff] text-white hover:bg-blue-600 shadow-xs hover:shadow-md transition-all flex items-center gap-1.5 cursor-pointer active:scale-98"
            >
              <span className="material-symbols-outlined text-[16px]">add_circle</span>
              <span>增加二维码额度</span>
            </button>
            <button
              type="button"
              onClick={() => {
                showToast('正在同步当前机构最新使用数据...', 'info');
                setTimeout(() => {
                  showToast('二维码使用数据已成功同步！', 'success');
                }, 350);
              }}
              className="p-2 rounded-xl border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors shadow-2xs cursor-pointer"
              title="刷新数据"
            >
              <span className="material-symbols-outlined text-[18px]">refresh</span>
            </button>
          </div>
        </div>

        {/* ========================================================= */}
        {/* 2. Top Metric Card: Exact Style Replica */}
        {/* ========================================================= */}
        <div className="mt-5 max-w-md">
          {/* Card 1: Exact Card from Image (Image 2 Replica) */}
          <div className="bg-[#fcfdff] rounded-2xl border border-indigo-100/90 p-5 shadow-xs hover:shadow-md transition-shadow relative overflow-hidden flex flex-col justify-between">
            <div>
              {/* Header Row: Icon + Title on left, Percentage on right */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-indigo-50 text-[#5b52f9] flex items-center justify-center">
                    <span className="material-symbols-outlined text-[18px]">qr_code_2</span>
                  </div>
                  <span className="text-sm font-bold text-gray-900 tracking-tight">二维码总数</span>
                </div>
                <span className="text-sm font-bold text-[#5b52f9] font-mono tracking-tight">
                  {usagePercentage}%
                </span>
              </div>

              {/* Big Number */}
              <div className="flex items-baseline gap-2 mt-3">
                <span className="text-3xl sm:text-4xl font-black text-gray-950 font-mono tracking-tight">
                  {totalLimit}
                </span>
                <span className="text-sm font-medium text-gray-500">个</span>
                <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/60 flex items-center gap-0.5 ml-1">
                  <span className="material-symbols-outlined text-[14px]">trending_up</span>
                  <span>名额充足</span>
                </span>
              </div>

              {/* Dynamic Purple/Indigo Progress Bar */}
              <div className="mt-4">
                <div className="h-3 w-full bg-indigo-50/90 rounded-full overflow-hidden border border-indigo-100/70 p-[1.5px]">
                  <div
                    className="h-full bg-gradient-to-r from-[#4f46e5] via-[#6366f1] to-[#7c3aed] rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(100, Math.max(0, parseFloat(usagePercentage)))}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Bottom Labels: 已用 xx 个 & 剩余 xx 个 */}
            <div className="flex items-center justify-between text-xs font-semibold text-[#5b52f9] pt-3.5 mt-4 border-t border-indigo-50/90">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#5b52f9]" />
                <span>已用 {usedCount} 个</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span className="text-[#5b52f9]">剩余 {remainingCount} 个</span>
              </span>
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* 3. Sub-Tab Switcher (History vs. Personnel vs. Policy) */}
        {/* ========================================================= */}
        <div className="mt-7 pt-4 border-t border-gray-100">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-1 bg-gray-100/80 p-1 rounded-xl w-fit">
              <button
                type="button"
                onClick={() => setActiveSubTab('records')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeSubTab === 'records'
                    ? 'bg-white text-gray-900 shadow-xs'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">history</span>
                <span>额度调整记录</span>
                <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-gray-100 text-gray-600 font-mono">
                  {history.length}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setActiveSubTab('personnel')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeSubTab === 'personnel'
                    ? 'bg-white text-gray-900 shadow-xs'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">badge</span>
                <span>扫码绑定人员明细</span>
                <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-indigo-50 text-indigo-700 font-mono font-bold">
                  {boundPersonnel.length}
                </span>
              </button>
            </div>

            {activeSubTab === 'personnel' && (
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-2 text-gray-400 text-[16px]">
                  search
                </span>
                <input
                  type="text"
                  value={personnelSearch}
                  onChange={(e) => setPersonnelSearch(e.target.value)}
                  placeholder="搜索人员、部门或职务..."
                  className="pl-8.5 pr-3 py-1.5 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all w-60"
                />
              </div>
            )}
          </div>

          {/* SubTab 1: Quota Change History */}
          {activeSubTab === 'records' && (
            <div className="border border-gray-200/90 rounded-2xl overflow-hidden shadow-2xs bg-white">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-gray-50/90 border-b border-gray-200 text-gray-600 font-semibold select-none">
                    <tr>
                      <th className="py-3 px-4">流水单号</th>
                      <th className="py-3 px-4">增加额度</th>
                      <th className="py-3 px-4">调整前额度</th>
                      <th className="py-3 px-4">调整后总额度</th>
                      <th className="py-3 px-4">增额事由</th>
                      <th className="py-3 px-4">经办人员</th>
                      <th className="py-3 px-4 text-right">操作时间</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-gray-700">
                    {history.map((rec) => (
                      <tr key={rec.id} className="hover:bg-indigo-50/20 transition-colors">
                        <td className="py-3 px-4 font-mono text-gray-500 font-medium">{rec.id}</td>
                        <td className="py-3 px-4">
                          <span className="inline-flex items-center font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-lg border border-emerald-200/80 font-mono">
                            +{rec.addAmount} 个
                          </span>
                        </td>
                        <td className="py-3 px-4 font-mono text-gray-600">{rec.previousLimit} 个</td>
                        <td className="py-3 px-4 font-mono font-bold text-gray-900">{rec.newLimit} 个</td>
                        <td className="py-3 px-4 text-gray-800 max-w-xs truncate" title={rec.reason}>
                          {rec.reason}
                        </td>
                        <td className="py-3 px-4 text-gray-600 flex items-center gap-1.5">
                          <span className="w-5 h-5 rounded-full bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center text-[10px] font-bold">
                            {rec.operator.charAt(0)}
                          </span>
                          <span>{rec.operator}</span>
                        </td>
                        <td className="py-3 px-4 text-right font-mono text-gray-400 text-[11px]">
                          {rec.createdAt}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* SubTab 2: Personnel Binding List */}
          {activeSubTab === 'personnel' && (
            <div className="border border-gray-200/90 rounded-2xl overflow-hidden shadow-2xs bg-white">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-gray-50/90 border-b border-gray-200 text-gray-600 font-semibold select-none">
                    <tr>
                      <th className="py-3 px-4">人员姓名</th>
                      <th className="py-3 px-4">所属单位/科室</th>
                      <th className="py-3 px-4">岗位职责</th>
                      <th className="py-3 px-4">绑定手机号</th>
                      <th className="py-3 px-4">扫码入驻时间</th>
                      <th className="py-3 px-4">状态</th>
                      <th className="py-3 px-4 text-right">操作</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-gray-700">
                    {filteredPersonnel.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="py-8 text-center text-gray-400">
                          没有找到符合条件的人员记录
                        </td>
                      </tr>
                    ) : (
                      filteredPersonnel.map((p) => (
                        <tr key={p.id} className="hover:bg-indigo-50/20 transition-colors">
                          <td className="py-3 px-4 font-bold text-gray-900 flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-indigo-50 text-indigo-600 border border-indigo-100 flex items-center justify-center text-xs font-bold">
                              {p.name.charAt(0)}
                            </div>
                            <span>{p.name}</span>
                          </td>
                          <td className="py-3 px-4 text-gray-700">{p.department}</td>
                          <td className="py-3 px-4">
                            <span className="px-2 py-0.5 rounded bg-gray-100 text-gray-700 font-medium text-[11px]">
                              {p.role}
                            </span>
                          </td>
                          <td className="py-3 px-4 font-mono text-gray-600">{p.phone}</td>
                          <td className="py-3 px-4 font-mono text-gray-400 text-[11px]">{p.bindTime}</td>
                          <td className="py-3 px-4">
                            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                              正常在岗
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <button
                              type="button"
                              onClick={() => handleUnbindPersonnel(p.id, p.name)}
                              className="text-rose-600 hover:text-rose-700 hover:underline font-semibold cursor-pointer text-xs"
                            >
                              解绑名额
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ========================================================= */}
      {/* 4. Modal: 增加二维码使用额度 */}
      {/* ========================================================= */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 w-full max-w-lg overflow-hidden animate-scale-in">
            {/* Modal Header */}
            <div className="px-6 py-4.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-indigo-700 text-white flex items-center justify-between shadow-xs">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-white/15 flex items-center justify-center backdrop-blur-xs">
                  <span className="material-symbols-outlined text-[20px]">add_circle</span>
                </div>
                <div>
                  <h3 className="text-base font-bold tracking-tight">增加机构二维码使用额度</h3>
                  <p className="text-[11px] text-white/80">为当前机构下辖采编人员扩充入驻名额</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="w-8 h-8 rounded-lg text-white/80 hover:text-white hover:bg-white/10 flex items-center justify-center transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleConfirmAddQuota} className="p-6 space-y-4.5">
              {/* Institution Name Info */}
              <div className="bg-gradient-to-r from-blue-50/80 to-indigo-50/80 rounded-xl p-3.5 border border-indigo-100 text-xs flex items-center justify-between">
                <div>
                  <div className="text-gray-500 text-[11px] font-medium">目标机构名称</div>
                  <div className="font-bold text-gray-900 text-sm mt-0.5">{instName}</div>
                </div>
                <div className="text-right">
                  <div className="text-gray-500 text-[11px] font-medium">当前额度现状</div>
                  <div className="font-bold font-mono text-indigo-700 text-sm mt-0.5">
                    {totalLimit} 个 (已用 {usedCount} / 剩 {remainingCount})
                  </div>
                </div>
              </div>

              {/* Amount Input */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-gray-800">
                  本次增发额度数量 <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min={1}
                    max={9999}
                    required
                    value={addAmount}
                    onChange={(e) => setAddAmount(Math.max(1, parseInt(e.target.value, 10) || 1))}
                    className="w-full border border-gray-300 rounded-xl px-3.5 py-2.5 text-base font-black font-mono text-gray-900 focus:outline-none focus:border-indigo-600 focus:ring-3 focus:ring-indigo-100 transition-all"
                    placeholder="请输入增加数量，例如 20"
                  />
                  <span className="absolute right-4 top-3 text-xs text-gray-400 font-semibold">
                    个名额
                  </span>
                </div>

                {/* Preset Quick Chips */}
                <div className="flex items-center gap-2 pt-0.5">
                  <span className="text-[11px] text-gray-400 font-medium">快捷增量:</span>
                  {[10, 20, 50, 100].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setAddAmount(preset)}
                      className={`px-3 py-1 rounded-lg text-xs font-bold border transition-all cursor-pointer active:scale-95 ${
                        addAmount === preset
                          ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                          : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100 hover:border-gray-300'
                      }`}
                    >
                      +{preset}
                    </button>
                  ))}
                </div>
              </div>

              {/* Preview resulting total */}
              <div className="bg-emerald-50/70 rounded-xl p-3.5 border border-emerald-200/70 text-xs flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-emerald-800 font-medium">
                  <span className="material-symbols-outlined text-[16px] text-emerald-600">
                    check_circle
                  </span>
                  <span>调整后机构总额度将变更为：</span>
                </div>
                <span className="text-base font-black font-mono text-emerald-700">
                  {totalLimit + (addAmount || 0)} 个
                </span>
              </div>

              {/* Reason Input */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-gray-800">
                  增发事由 / 批复说明
                </label>
                <input
                  type="text"
                  value={addReason}
                  onChange={(e) => setAddReason(e.target.value)}
                  placeholder="例如：曾都区融媒体中心新增应急速报网格员扫码入驻"
                  className="w-full border border-gray-300 rounded-xl px-3.5 py-2 text-xs text-gray-900 focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100"
                />
              </div>

              {/* Operator */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-gray-800">经办人员姓名</label>
                <input
                  type="text"
                  value={operatorName}
                  onChange={(e) => setOperatorName(e.target.value)}
                  className="w-full border border-gray-300 rounded-xl px-3.5 py-2 text-xs text-gray-900 focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100"
                />
              </div>

              {/* Modal Actions */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors cursor-pointer"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-[#1677ff] text-white hover:bg-blue-600 shadow-xs hover:shadow-md transition-all cursor-pointer flex items-center gap-1.5 active:scale-98"
                >
                  <span className="material-symbols-outlined text-[16px]">check</span>
                  <span>确认增加额度</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

