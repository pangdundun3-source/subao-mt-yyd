export type ActiveTab = 'home' | 'institutions' | 'config' | 'monitoring' | 'system';

export interface ExpiringInstitution {
  id: number;
  name: string;
  status: '试用' | '正式';
  region: string;
  category: string;
  industry: string;
  salesName: string;
  salesPhone: string;
  startDate?: string;
  endDate?: string;
  expireTime: string;
  daysRemaining: number;
  countdownText?: string;
  isExpired: boolean;
}

export type TemplateFieldType =
  | 'text'
  | 'textarea'
  | 'phone'
  | 'gender'
  | 'idcard'
  | 'bankcard'
  | 'role'
  | 'time'
  | 'number'
  | 'link'
  | 'attachment'
  | 'select'
  | string;

export interface TemplateFieldItem {
  id: string;
  name: string;
  type: TemplateFieldType;
  required: boolean;
  placeholder?: string;
  options?: string[];
}

export interface TemplateConfigItem {
  id: string;
  name: string;
  type: '报送' | '处置' | '研判' | '核查' | '激活' | string;
  status: boolean; // 启用 / 停用
  isSystem: boolean; // 是否系统默认
  isGlobal?: boolean; // 是否平台全局统一配置
  isCustom?: boolean; // 是否机构自定义
  description: string;
  updatedAt: string;
  fields: TemplateFieldItem[];
  // 保持原有字段向后兼容
  category?: string;
  themeColor?: string;
  isDefault?: boolean;
  coverStyle?: 'standard' | 'minimal' | 'banner' | 'card';
  headerText?: string;
  footerText?: string;
  watermarkText?: string;
  enableWatermark?: boolean;
}

export interface ScoringLevelItem {
  id: string;
  name: string;
  score: number;
  description: string;
}

export interface ScoringRuleGroup {
  id: string;
  name: string;
  scope: string;
  totalScore: number;
  levelCount: number;
  status: boolean; // 启用 / 停用
  isSystem: boolean; // 是否系统默认
  isGlobal?: boolean; // 是否平台全局统一配置
  isCustom?: boolean; // 是否机构自定义
  isCurrentActive?: boolean; // 是否当前生效
  description: string;
  updatedAt: string;
  levels: ScoringLevelItem[];
}

export interface ScoringDimension {
  id: string;
  name: string;
  maxScore: number;
  weight: number; // percentage e.g. 30
  description: string;
  deductionRules: string[];
  isGlobal?: boolean;
  isCustom?: boolean;
}

export interface DictItem {
  id: string;
  dictType: string;
  label: string;
  value: string;
  sortOrder: number;
  isSystem: boolean;
  isGlobal?: boolean; // 是否平台全局统一配置
  isCustom?: boolean; // 是否机构自定义
  status: boolean;
  description?: string;
  updatedAt?: string;
}

export interface AssessmentRuleItem {
  id: string;
  metricName: string;
  targetValue: number;
  unit: string;
  cycle: 'monthly' | 'quarterly' | 'yearly';
  weight: number;
  rewardPoints: number;
  penaltyPoints: number;
  isGlobal?: boolean; // 是否平台全局统一配置
  isCustom?: boolean; // 是否机构自定义
  status?: boolean; // 是否启用
}

export interface MetricFormulaConfig {
  readWeight: number;
  likeWeight: number;
  shareWeight: number;
  commentWeight: number;
  originalBonus: number;
  activeThreshold: number;
  statDimensions: string[];
  isGlobal?: boolean;
}

export interface ReviewLevelNode {
  id?: string;
  level: number;
  title: string;
  role: string;
  approvers: string[];
  timeoutHours: number;
  allowTransfer: boolean;
  allowDirectPublish: boolean;
  isGlobal?: boolean; // 是否平台全局统一配置
  isCustom?: boolean; // 是否机构自定义
  status?: boolean; // 是否启用
}

export interface LoginAuthConfig {
  allowPasswordLogin: boolean;
  allowSmsLogin: boolean;
  allowQyWechatQr: boolean;
  allowDingTalkSso: boolean;
  allowFeishuSso: boolean;
  requireMfa: boolean;
  passwordExpireDays: number;
  sessionTimeoutMinutes: number;
  ipWhitelistEnabled: boolean;
  ipWhitelist: string;
}

export interface ValueAddedServiceItem {
  id: string;
  name: string; // e.g. "批量审核", "截图取证", "指令流转", "系统公告"
  isPurchased: boolean; // 是否已开通
  isEnabled: boolean; // 是否已启用 (仅在已开通时可操作)
  tag: string; // "增值扩展功能"
  description: string;
  contactSalesTip?: string;
  icon?: string;
  isGlobal?: boolean;
  isCustom?: boolean;
}

export interface QrQuotaAddRecord {
  id: string;
  addAmount: number;
  previousLimit: number;
  newLimit: number;
  reason: string;
  operator: string;
  createdAt: string;
}

export interface QrCodeUsageConfig {
  totalLimit: number; // 二维码总数 (如: 50)
  usedCount: number; // 已用数量 (如: 18)
  historyRecords?: QrQuotaAddRecord[];
  allowSelfApply?: boolean;
  warningThreshold?: number;
}

export interface OtherBusinessConfig {
  qrUsage: QrCodeUsageConfig;
}

export interface InstitutionBusinessRules {
  // 1. 模版配置 (Template Configuration)
  templates: TemplateConfigItem[];
  selectedTemplateId: string;
  globalWatermarkText: string;
  defaultHeaderLogoUrl?: string;

  // 2. 审核打分规则 (Review Scoring Rules)
  passScore: number;
  excellentScore: number;
  scoringDimensions: ScoringDimension[];
  zeroToleranceViolation: boolean;
  scoringRuleGroups?: ScoringRuleGroup[];

  // 3. 数据字典维护 (Data Dictionary Maintenance)
  dictItems: DictItem[];

  // 4. 考核规则 (Assessment Rules)
  assessmentCycle: 'monthly' | 'quarterly' | 'yearly';
  assessmentRules: AssessmentRuleItem[];
  enablePenalty: boolean;

  // 5. 统计指标 (Statistical Metrics)
  metricsFormula: MetricFormulaConfig;

  // 6. 审核层级/流程 (Review Level / Process)
  workflowType: 'one_level' | 'two_level' | 'three_level' | 'custom';
  reviewNodes: ReviewLevelNode[];
  enableFastTrack: boolean;
  autoApproveKeywords: string[];

  // 7. 增值业务 (Value Added Services)
  valueAddedServices?: ValueAddedServiceItem[];

  // 8. 其他配置 (Other Business Config)
  otherConfig?: OtherBusinessConfig;

  // 登录验证方式 (Login Verification Method - 保留兼容)
  loginAuth?: LoginAuthConfig;

  // Legacy/Compatibility fields
  monitoringFrequency?: 'realtime' | '5min' | '15min' | '30min' | '60min';
  crawlChannels?: string[];
  focusKeywords?: string[];
  excludedKeywords?: string[];
  historyRetentionDays?: number;
  alertLevelThreshold?: 'level1' | 'level2' | 'level3' | 'level4';
  alertChannels?: string[];
}

export interface Institution {
  id: number;
  name: string;
  status: '试用' | '正式';
  location: string; // e.g. "甘肃", "陕西/西安"
  category: string; // e.g. "一类", "二类", "三类"
  industry: string; // e.g. "电力", "网信部门", "职校高校", "网安部门"
  salesName: string;
  salesPhone: string;
  enabled: boolean; // toggle switch state
  startDate: string;
  endDate: string;
  createdAt?: string;
  daysRemaining: number;
  unitName?: string;
  businessRules?: InstitutionBusinessRules;
}

export interface SystemConfig {
  siteName: string;
  autoNoticeDays: number;
  maxTrialDays: number;
  enableApiGateway: boolean;
  enableSmsAlerts: boolean;
  systemMaintenanceMode: boolean;
  dataRetentionMonths: number;
}

export interface AuditLog {
  id: string;
  operator: string;
  department: string;
  action: string;
  target: string;
  ip: string;
  time: string;
  status: '成功' | '失败';
}

export type SystemSubModule = 'accounts' | 'logs';

export type SystemRoleType =
  | 'super_admin'
  | 'ops_admin'
  | 'audit_admin'
  | 'config_admin'
  | 'business_lead'
  | 'sales_rep';

export interface SystemAccountUser {
  id: string;
  name: string;
  username: string;
  jobNumber: string;
  avatar?: string;
  gender: 'male' | 'female';
  phone: string;
  email: string;
  dept: string;
  roleId: SystemRoleType;
  roleName: string;
  roleBadgeColor: string;
  dataScope: 'all' | 'formal_only' | 'regional' | 'custom';
  dataScopeDesc: string;
  status: 'active' | 'disabled' | 'locked';
  mfaEnabled: boolean;
  ipWhitelist?: string;
  lastLoginTime: string;
  lastLoginIp: string;
  lastLoginLocation: string;
  createdAt: string;
  permissions?: string[];
  remarks?: string;
}

export type SystemLogCategory = 'login' | 'audit' | 'security' | 'data_change' | 'system_runtime';

export interface SystemLogItem {
  id: string;
  category: SystemLogCategory;
  operator: string;
  operatorUsername?: string;
  operatorJobNo?: string;
  department: string;
  role: string;
  action: string;
  module: string;
  target: string;
  targetId?: string;
  ip: string;
  location: string;
  browser?: string;
  os?: string;
  time: string;
  status: '成功' | '失败' | '警告' | '拦截';
  durationMs?: number;
  httpMethod?: string;
  apiUrl?: string;
  requestPayload?: Record<string, any> | string;
  responseSummary?: string;
  beforeChange?: Record<string, any> | string;
  afterChange?: Record<string, any> | string;
  errorCode?: string;
  errorMessage?: string;
}

