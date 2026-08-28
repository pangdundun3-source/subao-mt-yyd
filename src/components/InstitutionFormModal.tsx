import React, { useState, useEffect } from 'react';
import { Institution } from '../types';

interface FormModalProps {
  isOpen: boolean;
  editingInstitution: Institution | null;
  onClose: () => void;
  onSave: (institutionData: Partial<Institution>) => void;
}

export const InstitutionFormModal: React.FC<FormModalProps> = ({
  isOpen,
  editingInstitution,
  onClose,
  onSave,
}) => {
  const [formData, setFormData] = useState<Partial<Institution>>({
    name: '',
    status: '试用',
    location: '河南',
    category: '一类',
    industry: '网信部门',
    salesName: '王飞飞',
    salesPhone: '187****8601',
    enabled: true,
    startDate: new Date().toISOString().split('T')[0],
    endDate: '2026-12-31',
    unitName: '默认速报单元',
  });

  useEffect(() => {
    if (editingInstitution) {
      setFormData({ ...editingInstitution });
    } else {
      setFormData({
        name: '',
        status: '试用',
        location: '河南',
        category: '一类',
        industry: '网信部门',
        salesName: '王飞飞',
        salesPhone: '187****8601',
        enabled: true,
        startDate: new Date().toISOString().split('T')[0],
        endDate: '2026-12-31',
        unitName: '默认速报单元',
      });
    }
  }, [editingInstitution, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name?.trim()) return;

    // Calculate days remaining
    const end = new Date(formData.endDate || '2026-12-31').getTime();
    const now = new Date().getTime();
    const daysRemaining = Math.max(0, Math.ceil((end - now) / (1000 * 3600 * 24)));

    onSave({
      ...formData,
      daysRemaining,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-xl overflow-hidden border border-gray-100 flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-[#f8fafd]">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#1890ff] text-[22px]">
              {editingInstitution ? 'edit' : 'add_circle'}
            </span>
            <h3 className="text-lg font-bold text-[#333333]">
              {editingInstitution ? '编辑机构信息' : '新增机构服务账号'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto text-sm">
          {/* Name */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              机构全称 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.name || ''}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="请输入机构官方全称 (如：中共某某市委宣传部)"
              className="w-full border border-gray-300 rounded px-3 py-1.5 focus:outline-none focus:border-[#1890ff]"
            />
          </div>

          {/* Status & Category */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                机构类型/状态
              </label>
              <select
                value={formData.status || '试用'}
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.value as '试用' | '正式' })
                }
                className="w-full border border-gray-300 rounded px-3 py-1.5 focus:outline-none focus:border-[#1890ff] bg-white cursor-pointer"
              >
                <option value="试用">试用机构</option>
                <option value="正式">正式机构</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                机构类别
              </label>
              <select
                value={formData.category || '一类'}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full border border-gray-300 rounded px-3 py-1.5 focus:outline-none focus:border-[#1890ff] bg-white cursor-pointer"
              >
                <option value="一类">一类</option>
                <option value="二类">二类</option>
                <option value="三类">三类</option>
              </select>
            </div>
          </div>

          {/* Location & Industry */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                所在省份/区域
              </label>
              <input
                type="text"
                value={formData.location || ''}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="例如: 河南省郑州市"
                className="w-full border border-gray-300 rounded px-3 py-1.5 focus:outline-none focus:border-[#1890ff]"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                所属行业类型
              </label>
              <select
                value={formData.industry || '网信部门'}
                onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                className="w-full border border-gray-300 rounded px-3 py-1.5 focus:outline-none focus:border-[#1890ff] bg-white cursor-pointer"
              >
                <option value="网信部门">网信部门</option>
                <option value="电力">电力系统</option>
                <option value="职校高校">职校高校</option>
                <option value="网安部门">网安部门</option>
                <option value="媒体发布">媒体发布</option>
                <option value="广电广播">广电广播</option>
              </select>
            </div>
          </div>

          {/* Sales Contact */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                对接销售姓名
              </label>
              <input
                type="text"
                value={formData.salesName || ''}
                onChange={(e) => setFormData({ ...formData, salesName: e.target.value })}
                placeholder="责任销售人员"
                className="w-full border border-gray-300 rounded px-3 py-1.5 focus:outline-none focus:border-[#1890ff]"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                销售电话
              </label>
              <input
                type="text"
                value={formData.salesPhone || ''}
                onChange={(e) => setFormData({ ...formData, salesPhone: e.target.value })}
                placeholder="例如: 187****8601"
                className="w-full border border-gray-300 rounded px-3 py-1.5 focus:outline-none focus:border-[#1890ff]"
              />
            </div>
          </div>

          {/* Service Dates */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                服务开始时间
              </label>
              <input
                type="date"
                value={formData.startDate || ''}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                className="w-full border border-gray-300 rounded px-3 py-1.5 focus:outline-none focus:border-[#1890ff]"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                服务截止时间
              </label>
              <input
                type="date"
                value={formData.endDate || ''}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                className="w-full border border-gray-300 rounded px-3 py-1.5 focus:outline-none focus:border-[#1890ff]"
              />
            </div>
          </div>

          {/* Unit Name */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              统计单元名称
            </label>
            <input
              type="text"
              value={formData.unitName || ''}
              onChange={(e) => setFormData({ ...formData, unitName: e.target.value })}
              placeholder="请输入所属统计单元 (如：河南省网信单元)"
              className="w-full border border-gray-300 rounded px-3 py-1.5 focus:outline-none focus:border-[#1890ff]"
            />
          </div>

          {/* Form Action Buttons */}
          <div className="pt-4 border-t border-gray-100 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="border border-gray-300 text-gray-700 px-4 py-1.5 rounded text-sm hover:bg-gray-50 transition-colors cursor-pointer"
            >
              取消
            </button>
            <button
              type="submit"
              className="bg-[#1890ff] text-white px-5 py-1.5 rounded text-sm font-medium hover:bg-blue-600 transition-colors shadow-sm cursor-pointer flex items-center"
            >
              <span className="material-symbols-outlined text-[18px] mr-1">
                check
              </span>
              确认保存
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
