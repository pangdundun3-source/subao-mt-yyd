import React, { useState } from 'react';
import { SystemAccountUser, SystemRoleType } from '../../types';
import {
  initialSystemAccounts,
  systemRoleOptions,
  systemDepartmentOptions,
} from './systemData';

interface AccountManagementProps {
  onShowToast?: (msg: string) => void;
}

export const AccountManagement: React.FC<AccountManagementProps> = ({ onShowToast }) => {
  const [accounts, setAccounts] = useState<SystemAccountUser[]>(initialSystemAccounts);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState<string>('all');
  const [selectedDept, setSelectedDept] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedAccountIds, setSelectedAccountIds] = useState<string[]>([]);

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState<SystemAccountUser | null>(null);
  const [resettingAccount, setResettingAccount] = useState<SystemAccountUser | null>(null);
  const [viewingPermissionsAccount, setViewingPermissionsAccount] =
    useState<SystemAccountUser | null>(null);
  const [generatedPassword, setGeneratedPassword] = useState('');
  const [mustChangePasswordOnLogin, setMustChangePasswordOnLogin] = useState(true);

  // Form State
  const [formState, setFormState] = useState<{
    name: string;
    username: string;
    jobNumber: string;
    gender: 'male' | 'female';
    phone: string;
    email: string;
    dept: string;
    roleId: SystemRoleType;
    dataScope: 'all' | 'formal_only' | 'regional' | 'custom';
    mfaEnabled: boolean;
    ipWhitelist: string;
    remarks: string;
  }>({
    name: '',
    username: '',
    jobNumber: '',
    gender: 'male',
    phone: '',
    email: '',
    dept: systemDepartmentOptions[0],
    roleId: 'ops_admin',
    dataScope: 'all',
    mfaEnabled: true,
    ipWhitelist: '',
    remarks: '',
  });

  const notify = (msg: string) => {
    if (onShowToast) {
      onShowToast(msg);
    }
  };

  // Filtered accounts
  const filteredAccounts = accounts.filter((acc) => {
    const matchSearch =
      acc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      acc.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      acc.jobNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      acc.phone.includes(searchTerm);

    const matchRole = selectedRole === 'all' || acc.roleId === selectedRole;
    const matchDept = selectedDept === 'all' || acc.dept === selectedDept;
    const matchStatus = selectedStatus === 'all' || acc.status === selectedStatus;

    return matchSearch && matchRole && matchDept && matchStatus;
  });

  // Calculate Metrics
  const totalAccounts = accounts.length;
  const activeAccounts = accounts.filter((a) => a.status === 'active').length;
  const disabledAccounts = accounts.filter((a) => a.status === 'disabled').length;
  const mfaCount = accounts.filter((a) => a.mfaEnabled).length;

  const handleOpenCreateModal = () => {
    setEditingAccount(null);
    setFormState({
      name: '',
      username: '',
      jobNumber: `MT-${8000 + accounts.length + 1}`,
      gender: 'male',
      phone: '',
      email: '',
      dept: systemDepartmentOptions[0],
      roleId: 'ops_admin',
      dataScope: 'all',
      mfaEnabled: true,
      ipWhitelist: '',
      remarks: '',
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (acc: SystemAccountUser) => {
    setEditingAccount(acc);
    setFormState({
      name: acc.name,
      username: acc.username,
      jobNumber: acc.jobNumber,
      gender: acc.gender,
      phone: acc.phone,
      email: acc.email,
      dept: acc.dept,
      roleId: acc.roleId,
      dataScope: acc.dataScope,
      mfaEnabled: acc.mfaEnabled,
      ipWhitelist: acc.ipWhitelist || '',
      remarks: acc.remarks || '',
    });
    setIsModalOpen(true);
  };

  const handleSaveAccount = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formState.name.trim() || !formState.username.trim()) {
      notify('请完整填写姓名与登录账号');
      return;
    }

    const matchedRole = systemRoleOptions.find((r) => r.id === formState.roleId);
    const roleName = matchedRole?.name || '管理人员';
    const roleBadgeColor =
      matchedRole?.color || 'bg-gray-50 text-gray-700 border-gray-200';

    let dataScopeDesc = '全网所有机构与系统设置 (无限制)';
    if (formState.dataScope === 'formal_only') {
      dataScopeDesc = '仅限正式签约生效机构数据';
    } else if (formState.dataScope === 'regional') {
      dataScopeDesc = '所属大区及指定省市机构数据';
    } else if (formState.dataScope === 'custom') {
      dataScopeDesc = '自定义指定机构白名单权限';
    }

    if (editingAccount) {
      setAccounts((prev) =>
        prev.map((acc) =>
          acc.id === editingAccount.id
            ? {
                ...acc,
                ...formState,
                roleName,
                roleBadgeColor,
                dataScopeDesc,
              }
            : acc
        )
      );
      notify(`已成功更新账号【${formState.name} (${formState.username})】信息`);
    } else {
      const newAcc: SystemAccountUser = {
        id: `ACC-${String(accounts.length + 1).padStart(3, '0')}`,
        ...formState,
        roleName,
        roleBadgeColor,
        dataScopeDesc,
        status: 'active',
        lastLoginTime: '从未登录',
        lastLoginIp: '--',
        lastLoginLocation: '--',
        createdAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
        permissions: ['基础业务查看', '本部门报表检索'],
      };
      setAccounts((prev) => [newAcc, ...prev]);
      notify(`已成功创建新管理账号【${newAcc.name} (${newAcc.username})】`);
    }

    setIsModalOpen(false);
  };

  const handleToggleStatus = (acc: SystemAccountUser) => {
    const nextStatus = acc.status === 'active' ? 'disabled' : 'active';
    setAccounts((prev) =>
      prev.map((a) => (a.id === acc.id ? { ...a, status: nextStatus } : a))
    );
    notify(
      `已将账号【${acc.name}】状态更改为：${
        nextStatus === 'active' ? '正常启用' : '已冻结禁用'
      }`
    );
  };

  const handleDeleteAccount = (acc: SystemAccountUser) => {
    if (acc.roleId === 'super_admin') {
      notify('超级管理员账号不可直接删除！');
      return;
    }
    if (acc.status === 'active') {
      notify('启用状态不支持删除，请先禁用该账号后再进行删除！');
      return;
    }
    if (window.confirm(`确定要永久删除已禁用的账号【${acc.name} (${acc.username})】吗？`)) {
      setAccounts((prev) => prev.filter((a) => a.id !== acc.id));
      notify(`已成功删除账号【${acc.name}】`);
    }
  };

  const handleOpenResetPassword = (acc: SystemAccountUser) => {
    setResettingAccount(acc);
    // Generate secure random temp password
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789!@#$%';
    let pwd = 'Mt#';
    for (let i = 0; i < 7; i++) {
      pwd += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    pwd += '@2026';
    setGeneratedPassword(pwd);
    setMustChangePasswordOnLogin(true);
  };

  const handleConfirmResetPassword = () => {
    if (resettingAccount) {
      notify(`已成功重置【${resettingAccount.name}】的登录密码为：${generatedPassword}`);
      setResettingAccount(null);
    }
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedAccountIds(filteredAccounts.map((a) => a.id));
    } else {
      setSelectedAccountIds([]);
    }
  };

  const handleSelectOne = (id: string) => {
    setSelectedAccountIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleBatchEnable = () => {
    if (selectedAccountIds.length === 0) return;
    setAccounts((prev) =>
      prev.map((a) =>
        selectedAccountIds.includes(a.id) ? { ...a, status: 'active' } : a
      )
    );
    notify(`已批量启用 ${selectedAccountIds.length} 个账号`);
    setSelectedAccountIds([]);
  };

  const handleBatchDisable = () => {
    if (selectedAccountIds.length === 0) return;
    setAccounts((prev) =>
      prev.map((a) =>
        selectedAccountIds.includes(a.id) && a.roleId !== 'super_admin'
          ? { ...a, status: 'disabled' }
          : a
      )
    );
    notify(`已批量冻结选中的账号`);
    setSelectedAccountIds([]);
  };

  return (
    <div className="space-y-6">
      {/* 1. Main Search & Filter & Action Bar */}
      <div className="bg-white rounded-lg border border-gray-100 p-5 shadow-[0_1px_3px_0_rgba(0,0,0,0.03)]">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-gray-100">
          <div className="flex flex-wrap items-center gap-3">
            {/* Search input */}
            <div className="relative min-w-[220px]">
              <span className="material-symbols-outlined absolute left-3 top-2.5 text-gray-400 text-[18px]">
                search
              </span>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="搜索姓名 / 账号 / 工号 / 手机"
                className="w-full pl-9 pr-3 py-2 text-xs border border-gray-200 rounded-md focus:outline-none focus:border-[#1890ff] focus:ring-1 focus:ring-[#1890ff]"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-2.5 top-2.5 text-gray-400 hover:text-gray-600 text-xs"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Role Filter */}
            <div className="flex items-center text-xs text-gray-600">
              <span className="mr-1.5 text-gray-500">角色:</span>
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="border border-gray-200 rounded-md px-2.5 py-2 text-xs focus:outline-none focus:border-[#1890ff] bg-white cursor-pointer"
              >
                <option value="all">全部角色</option>
                {systemRoleOptions.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Department Filter */}
            <div className="flex items-center text-xs text-gray-600">
              <span className="mr-1.5 text-gray-500">部门:</span>
              <select
                value={selectedDept}
                onChange={(e) => setSelectedDept(e.target.value)}
                className="border border-gray-200 rounded-md px-2.5 py-2 text-xs focus:outline-none focus:border-[#1890ff] bg-white cursor-pointer"
              >
                <option value="all">全部部门</option>
                {systemDepartmentOptions.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
            </div>

            {/* Status Filter */}
            <div className="flex items-center text-xs text-gray-600">
              <span className="mr-1.5 text-gray-500">状态:</span>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="border border-gray-200 rounded-md px-2.5 py-2 text-xs focus:outline-none focus:border-[#1890ff] bg-white cursor-pointer"
              >
                <option value="all">全部状态</option>
                <option value="active">正常在用</option>
                <option value="disabled">已冻结/禁用</option>
              </select>
            </div>

            {(searchTerm ||
              selectedRole !== 'all' ||
              selectedDept !== 'all' ||
              selectedStatus !== 'all') && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedRole('all');
                  setSelectedDept('all');
                  setSelectedStatus('all');
                }}
                className="text-xs text-[#1890ff] hover:underline px-2 py-1"
              >
                重置筛选
              </button>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2.5 shrink-0">
            {selectedAccountIds.length > 0 && (
              <div className="flex items-center gap-2 bg-blue-50 text-blue-800 px-3 py-1.5 rounded-md text-xs border border-blue-200">
                <span>已选中 {selectedAccountIds.length} 项</span>
                <button
                  onClick={handleBatchEnable}
                  className="text-[#1890ff] hover:underline font-medium ml-1"
                >
                  批量启用
                </button>
                <span className="text-gray-300">|</span>
                <button
                  onClick={handleBatchDisable}
                  className="text-amber-600 hover:underline font-medium"
                >
                  批量冻结
                </button>
              </div>
            )}

            <button
              onClick={handleOpenCreateModal}
              className="bg-[#1890ff] hover:bg-blue-600 text-white px-3.5 py-2 rounded-md text-xs font-medium transition-colors flex items-center shadow-sm cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px] mr-1">person_add</span>
              新建管理员
            </button>
          </div>
        </div>

        {/* 3. Accounts Data Table */}
        <div className="mt-4 overflow-x-auto rounded-lg border border-gray-100">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#f8fafd] text-[#666666] border-b border-gray-200">
                <th className="py-3 px-3 w-10 text-center">
                  <input
                    type="checkbox"
                    checked={
                      filteredAccounts.length > 0 &&
                      selectedAccountIds.length === filteredAccounts.length
                    }
                    onChange={handleSelectAll}
                    className="rounded border-gray-300 text-[#1890ff] focus:ring-[#1890ff] cursor-pointer"
                  />
                </th>
                <th className="py-3 px-4 font-semibold text-gray-700">管理员信息</th>
                <th className="py-3 px-4 font-semibold text-gray-700">登录账号</th>
                <th className="py-3 px-4 font-semibold text-gray-700">所属部门</th>
                <th className="py-3 px-4 font-semibold text-gray-700">角色与权限</th>
                <th className="py-3 px-4 font-semibold text-gray-700">数据范围</th>
                <th className="py-3 px-4 font-semibold text-gray-700">状态</th>
                <th className="py-3 px-4 font-semibold text-gray-700">最后登录</th>
                <th className="py-3 px-4 font-semibold text-gray-700 text-right">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredAccounts.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-gray-400">
                    <span className="material-symbols-outlined text-[40px] text-gray-300 mb-2">
                      person_search
                    </span>
                    <p>没有找到符合条件的管理员账号</p>
                  </td>
                </tr>
              ) : (
                filteredAccounts.map((acc) => {
                  const isSelected = selectedAccountIds.includes(acc.id);
                  return (
                    <tr
                      key={acc.id}
                      className={`hover:bg-blue-50/40 transition-colors ${
                        isSelected ? 'bg-blue-50/60' : ''
                      }`}
                    >
                      <td className="py-3.5 px-3 text-center">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleSelectOne(acc.id)}
                          className="rounded border-gray-300 text-[#1890ff] focus:ring-[#1890ff] cursor-pointer"
                        />
                      </td>

                      {/* User Info */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2.5">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                              acc.gender === 'female'
                                ? 'bg-pink-100 text-pink-700'
                                : 'bg-blue-100 text-[#1890ff]'
                            }`}
                          >
                            {acc.name.substring(0, 1)}
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="font-semibold text-gray-800 text-[13px]">
                                {acc.name}
                              </span>
                              <span className="text-[11px] text-gray-400 font-mono">
                                ({acc.jobNumber})
                              </span>
                            </div>
                            <div className="text-[11px] text-gray-400 mt-0.5 font-mono">
                              {acc.phone}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Username & Email */}
                      <td className="py-3.5 px-4">
                        <div className="font-mono text-gray-800 font-medium">{acc.username}</div>
                        <div className="text-[11px] text-gray-400">{acc.email}</div>
                      </td>

                      {/* Dept */}
                      <td className="py-3.5 px-4 text-gray-700 font-medium">{acc.dept}</td>

                      {/* Role & Permissions Badge */}
                      <td className="py-3.5 px-4">
                        <div className="flex flex-col gap-1 items-start">
                          <span
                            className={`px-2 py-0.5 rounded text-[11px] border font-medium ${acc.roleBadgeColor}`}
                          >
                            {acc.roleName}
                          </span>
                          <button
                            onClick={() => setViewingPermissionsAccount(acc)}
                            className="text-[11px] text-[#1890ff] hover:underline flex items-center gap-0.5"
                          >
                            <span className="material-symbols-outlined text-[13px]">
                              visibility
                            </span>
                            权限清单
                          </button>
                        </div>
                      </td>

                      {/* Data Scope */}
                      <td className="py-3.5 px-4">
                        <span
                          className="text-[11px] text-gray-600 line-clamp-2 max-w-[150px]"
                          title={acc.dataScopeDesc}
                        >
                          {acc.dataScopeDesc}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4">
                        <button
                          type="button"
                          role="switch"
                          aria-checked={acc.status === 'active'}
                          onClick={() => handleToggleStatus(acc)}
                          className={`relative inline-flex h-5 w-11 shrink-0 cursor-pointer items-center rounded-full transition-colors duration-200 ease-in-out focus:outline-none select-none px-0.5 ${
                            acc.status === 'active'
                              ? 'bg-[#1890ff]'
                              : 'bg-gray-300 hover:bg-gray-400'
                          }`}
                          title={acc.status === 'active' ? '点击禁用该账号' : '点击启用该账号'}
                        >
                          {/* Inner Text Label */}
                          <span
                            className={`absolute text-[11px] font-bold leading-none text-white transition-opacity duration-200 pointer-events-none ${
                              acc.status === 'active'
                                ? 'left-1.5 opacity-100'
                                : 'right-1.5 opacity-100 text-gray-50'
                            }`}
                          >
                            {acc.status === 'active' ? '启' : '禁'}
                          </span>

                          {/* Slider Knob */}
                          <span
                            className={`pointer-events-none z-10 inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                              acc.status === 'active' ? 'translate-x-6' : 'translate-x-0'
                            }`}
                          />
                        </button>
                      </td>

                      {/* Last Login */}
                      <td className="py-3.5 px-4 text-gray-500">
                        <div className="font-mono text-[11px] text-gray-700">
                          {acc.lastLoginTime}
                        </div>
                        <div className="text-[11px] text-gray-400 flex items-center gap-1 mt-0.5">
                          <span>{acc.lastLoginIp}</span>
                          {acc.lastLoginLocation !== '--' && (
                            <span className="text-gray-500 font-sans">
                              · {acc.lastLoginLocation}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleOpenEditModal(acc)}
                            className="text-[#1890ff] hover:text-blue-700 font-medium text-xs cursor-pointer"
                          >
                            编辑
                          </button>
                          <button
                            onClick={() => handleDeleteAccount(acc)}
                            disabled={acc.roleId === 'super_admin' || acc.status === 'active'}
                            title={
                              acc.roleId === 'super_admin'
                                ? '超级管理员账号不可删除'
                                : acc.status === 'active'
                                ? '启用状态不支持删除，需先禁用账号'
                                : '删除该账号'
                            }
                            className={`text-xs ${
                              acc.roleId === 'super_admin' || acc.status === 'active'
                                ? 'text-gray-300 cursor-not-allowed select-none'
                                : 'text-red-500 hover:text-red-700 cursor-pointer font-medium'
                            }`}
                          >
                            删除
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer */}
        <div className="flex items-center justify-between mt-4 text-xs text-gray-500">
          <div>
            共检索出 <span className="font-semibold text-gray-800">{filteredAccounts.length}</span>{' '}
            位管理员账号
          </div>
          <div className="flex items-center gap-2">
            <span className="text-gray-400">每页 10 条</span>
            <div className="flex items-center gap-1">
              <button
                disabled
                className="px-2.5 py-1 border border-gray-200 rounded text-gray-400 bg-gray-50 cursor-not-allowed"
              >
                ‹ 上一页
              </button>
              <button className="px-2.5 py-1 bg-[#1890ff] text-white rounded font-medium">
                1
              </button>
              <button
                disabled
                className="px-2.5 py-1 border border-gray-200 rounded text-gray-400 bg-gray-50 cursor-not-allowed"
              >
                下一页 ›
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Create / Edit Account Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#1890ff] text-[22px]">
                  {editingAccount ? 'manage_accounts' : 'person_add'}
                </span>
                <h3 className="text-base font-bold text-gray-800">
                  {editingAccount
                    ? `编辑管理员账号【${editingAccount.name}】`
                    : '新建系统管理员账号'}
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 text-lg p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveAccount} className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-medium text-gray-700 mb-1">
                    真实姓名 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formState.name}
                    onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                    placeholder="例如：张建国"
                    className="w-full border border-gray-200 rounded-md px-3 py-2 focus:outline-none focus:border-[#1890ff]"
                  />
                </div>

                <div>
                  <label className="block font-medium text-gray-700 mb-1">
                    登录用户名 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formState.username}
                    onChange={(e) => setFormState({ ...formState, username: e.target.value })}
                    placeholder="字母数字组合，如：zhangjg"
                    className="w-full border border-gray-200 rounded-md px-3 py-2 font-mono focus:outline-none focus:border-[#1890ff]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-medium text-gray-700 mb-1">工号编号</label>
                  <input
                    type="text"
                    value={formState.jobNumber}
                    onChange={(e) => setFormState({ ...formState, jobNumber: e.target.value })}
                    placeholder="如：MT-8010"
                    className="w-full border border-gray-200 rounded-md px-3 py-2 font-mono focus:outline-none focus:border-[#1890ff]"
                  />
                </div>

                <div>
                  <label className="block font-medium text-gray-700 mb-1">性别</label>
                  <div className="flex gap-4 items-center h-[34px]">
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="radio"
                        name="gender"
                        checked={formState.gender === 'male'}
                        onChange={() => setFormState({ ...formState, gender: 'male' })}
                        className="text-[#1890ff] focus:ring-[#1890ff]"
                      />
                      <span>男</span>
                    </label>
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="radio"
                        name="gender"
                        checked={formState.gender === 'female'}
                        onChange={() => setFormState({ ...formState, gender: 'female' })}
                        className="text-[#1890ff] focus:ring-[#1890ff]"
                      />
                      <span>女</span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-medium text-gray-700 mb-1">
                    手机号码 (用于短信核验与通知) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={formState.phone}
                    onChange={(e) => setFormState({ ...formState, phone: e.target.value })}
                    placeholder="11位手机号"
                    className="w-full border border-gray-200 rounded-md px-3 py-2 font-mono focus:outline-none focus:border-[#1890ff]"
                  />
                </div>

                <div>
                  <label className="block font-medium text-gray-700 mb-1">电子邮箱</label>
                  <input
                    type="email"
                    value={formState.email}
                    onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                    placeholder="name@company.com"
                    className="w-full border border-gray-200 rounded-md px-3 py-2 focus:outline-none focus:border-[#1890ff]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-medium text-gray-700 mb-1">所属部门</label>
                  <select
                    value={formState.dept}
                    onChange={(e) => setFormState({ ...formState, dept: e.target.value })}
                    className="w-full border border-gray-200 rounded-md px-3 py-2 focus:outline-none focus:border-[#1890ff] bg-white"
                  >
                    {systemDepartmentOptions.map((dept) => (
                      <option key={dept} value={dept}>
                        {dept}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-medium text-gray-700 mb-1">
                    角色权限 <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formState.roleId}
                    onChange={(e) =>
                      setFormState({
                        ...formState,
                        roleId: e.target.value as SystemRoleType,
                      })
                    }
                    className="w-full border border-gray-200 rounded-md px-3 py-2 focus:outline-none focus:border-[#1890ff] bg-white"
                  >
                    {systemRoleOptions.map((role) => (
                      <option key={role.id} value={role.id}>
                        {role.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Data Scope */}
              <div>
                <label className="block font-medium text-gray-700 mb-1">
                  数据访问权限范围
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <label
                    className={`p-2.5 border rounded-lg cursor-pointer flex flex-col gap-1 transition-all ${
                      formState.dataScope === 'all'
                        ? 'border-[#1890ff] bg-blue-50/50 text-[#1890ff]'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-1.5">
                      <input
                        type="radio"
                        name="dataScope"
                        checked={formState.dataScope === 'all'}
                        onChange={() => setFormState({ ...formState, dataScope: 'all' })}
                        className="text-[#1890ff]"
                      />
                      <span className="font-semibold text-gray-800">全网所有机构</span>
                    </div>
                    <span className="text-[11px] text-gray-500">
                      拥有全平台所有正式及试用机构查看与操作权
                    </span>
                  </label>

                  <label
                    className={`p-2.5 border rounded-lg cursor-pointer flex flex-col gap-1 transition-all ${
                      formState.dataScope === 'formal_only'
                        ? 'border-[#1890ff] bg-blue-50/50 text-[#1890ff]'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-1.5">
                      <input
                        type="radio"
                        name="dataScope"
                        checked={formState.dataScope === 'formal_only'}
                        onChange={() =>
                          setFormState({ ...formState, dataScope: 'formal_only' })
                        }
                        className="text-[#1890ff]"
                      />
                      <span className="font-semibold text-gray-800">仅正式签约机构</span>
                    </div>
                    <span className="text-[11px] text-gray-500">
                      仅可访问已正式签约生效的付费机构
                    </span>
                  </label>

                  <label
                    className={`p-2.5 border rounded-lg cursor-pointer flex flex-col gap-1 transition-all ${
                      formState.dataScope === 'regional'
                        ? 'border-[#1890ff] bg-blue-50/50 text-[#1890ff]'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-1.5">
                      <input
                        type="radio"
                        name="dataScope"
                        checked={formState.dataScope === 'regional'}
                        onChange={() => setFormState({ ...formState, dataScope: 'regional' })}
                        className="text-[#1890ff]"
                      />
                      <span className="font-semibold text-gray-800">按所属大区隔离</span>
                    </div>
                    <span className="text-[11px] text-gray-500">
                      仅可管理其所在区域内的客户机构
                    </span>
                  </label>
                </div>
              </div>

              {/* IP Whitelist & MFA */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-medium text-gray-700 mb-1">
                    登录 IP 白名单限制 (选填)
                  </label>
                  <input
                    type="text"
                    value={formState.ipWhitelist}
                    onChange={(e) =>
                      setFormState({ ...formState, ipWhitelist: e.target.value })
                    }
                    placeholder="如：192.168.1.0/24, 10.0.0.0/8"
                    className="w-full border border-gray-200 rounded-md px-3 py-2 font-mono text-xs focus:outline-none focus:border-[#1890ff]"
                  />
                  <p className="text-[10px] text-gray-400 mt-1">
                    留空则允许公网/企业内网正常登录，填入则仅放行指定 CIDR IP 段
                  </p>
                </div>

                <div>
                  <label className="block font-medium text-gray-700 mb-1">
                    MFA 双因子认证
                  </label>
                  <label className="flex items-center gap-2 p-2.5 border border-gray-200 rounded-md cursor-pointer hover:bg-gray-50">
                    <input
                      type="checkbox"
                      checked={formState.mfaEnabled}
                      onChange={(e) =>
                        setFormState({ ...formState, mfaEnabled: e.target.checked })
                      }
                      className="rounded border-gray-300 text-[#1890ff] focus:ring-[#1890ff]"
                    />
                    <div>
                      <span className="font-semibold text-gray-800">强制开启 MFA 认证</span>
                      <p className="text-[10px] text-gray-400">
                        登录时需输入动态口令或企微核身
                      </p>
                    </div>
                  </label>
                </div>
              </div>

              <div>
                <label className="block font-medium text-gray-700 mb-1">备注说明</label>
                <textarea
                  rows={2}
                  value={formState.remarks}
                  onChange={(e) => setFormState({ ...formState, remarks: e.target.value })}
                  placeholder="岗位交接要求、职责分工或特殊权限说明"
                  className="w-full border border-gray-200 rounded-md px-3 py-2 focus:outline-none focus:border-[#1890ff]"
                ></textarea>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-gray-200 rounded-md text-gray-600 hover:bg-gray-50"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#1890ff] hover:bg-blue-600 text-white rounded-md font-medium shadow-sm"
                >
                  {editingAccount ? '保存修改' : '确认创建账号'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 5. Reset Password Modal */}
      {resettingAccount && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 space-y-4 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-amber-500 text-[22px]">
                  lock_reset
                </span>
                <h3 className="text-base font-bold text-gray-800">重置管理员密码</h3>
              </div>
              <button
                onClick={() => setResettingAccount(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <p className="text-gray-600">
              正在为管理员{' '}
              <strong className="text-gray-900 font-semibold">{resettingAccount.name}</strong>{' '}
              (账号: <code className="bg-gray-100 px-1 py-0.5 rounded font-mono">{resettingAccount.username}</code>) 生成全新随机临时安全密码：
            </p>

            <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg flex items-center justify-between">
              <div>
                <span className="text-[11px] text-gray-500 block">临时强安全密码：</span>
                <span className="font-mono text-base font-bold text-[#1890ff] tracking-wider select-all">
                  {generatedPassword}
                </span>
              </div>
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(generatedPassword);
                  notify('临时密码已复制到剪贴板！');
                }}
                className="bg-white border border-blue-300 text-[#1890ff] px-3 py-1.5 rounded text-xs font-medium hover:bg-blue-50 flex items-center gap-1 shadow-xs cursor-pointer"
              >
                <span className="material-symbols-outlined text-[14px]">content_copy</span>
                复制
              </button>
            </div>

            <label className="flex items-center gap-2 text-gray-700 cursor-pointer pt-1">
              <input
                type="checkbox"
                checked={mustChangePasswordOnLogin}
                onChange={(e) => setMustChangePasswordOnLogin(e.target.checked)}
                className="rounded border-gray-300 text-[#1890ff] focus:ring-[#1890ff]"
              />
              <span>要求该用户首次登录时必须立即修改密码 (推荐)</span>
            </label>

            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setResettingAccount(null)}
                className="px-4 py-2 border border-gray-200 rounded-md text-gray-600 hover:bg-gray-50"
              >
                取消
              </button>
              <button
                type="button"
                onClick={handleConfirmResetPassword}
                className="px-5 py-2 bg-[#1890ff] hover:bg-blue-600 text-white rounded-md font-medium shadow-sm"
              >
                确认重置
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 6. Permissions Viewer Drawer */}
      {viewingPermissionsAccount && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full p-6 space-y-4 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-purple-600 text-[22px]">
                  security
                </span>
                <h3 className="text-base font-bold text-gray-800">
                  【{viewingPermissionsAccount.name}】权限清单
                </h3>
              </div>
              <button
                onClick={() => setViewingPermissionsAccount(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <div className="bg-gray-50 p-3.5 rounded-lg space-y-1.5">
              <div className="flex justify-between">
                <span className="text-gray-500">所属角色：</span>
                <span className="font-semibold text-gray-800">
                  {viewingPermissionsAccount.roleName}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">所属部门：</span>
                <span className="font-semibold text-gray-800">
                  {viewingPermissionsAccount.dept}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">数据范围：</span>
                <span className="font-semibold text-[#1890ff]">
                  {viewingPermissionsAccount.dataScopeDesc}
                </span>
              </div>
            </div>

            <div>
              <h4 className="font-bold text-gray-700 mb-2">已授权的功能模块清单：</h4>
              <div className="space-y-2">
                {(viewingPermissionsAccount.permissions || [
                  '机构查看',
                  '基础配置浏览',
                ]).map((perm, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-2 rounded bg-blue-50/50 border border-blue-100"
                  >
                    <span className="text-gray-800 font-medium flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-green-600 text-[16px]">
                        check_circle
                      </span>
                      {perm}
                    </span>
                    <span className="text-[11px] text-green-700 bg-green-50 px-2 py-0.5 rounded">
                      已生效
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end pt-3 border-t border-gray-100">
              <button
                onClick={() => setViewingPermissionsAccount(null)}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md font-medium"
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
