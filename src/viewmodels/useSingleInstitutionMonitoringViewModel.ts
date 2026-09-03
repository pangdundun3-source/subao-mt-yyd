import { useMemo, useState } from 'react';
import type { MouseEvent } from 'react';
import {
  mockPersonnelList,
  mockReportReviewEvents,
  OrgTreeNode,
} from '../components/operations/monitoringData';

type MonitoringTab = 'overview' | 'personnel' | 'pipeline' | 'matrix';
type TimeRange = 'today' | '7days' | '30days' | 'quarter';

export const useSingleInstitutionMonitoringViewModel = (institution: OrgTreeNode) => {
  const [selectedSubNodeId, setSelectedSubNodeId] = useState('ROOT');
  const [treeExpandedKeys, setTreeExpandedKeys] = useState<Record<string, boolean>>({
    [institution.id]: true,
    ...(institution.children?.reduce<Record<string, boolean>>(
      (expanded, child) => ({ ...expanded, [child.id]: true }),
      {}
    ) || {}),
  });
  const [treeSearchQuery, setTreeSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<MonitoringTab>('overview');
  const [timeRange, setTimeRange] = useState<TimeRange>('today');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [personnelSearch, setPersonnelSearch] = useState('');
  const [eventCategoryFilter, setEventCategoryFilter] = useState('ALL');
  const [eventStatusFilter, setEventStatusFilter] = useState('ALL');

  const handleRefresh = () => {
    setIsRefreshing(true);
    window.setTimeout(() => setIsRefreshing(false), 500);
  };

  const toggleTreeNode = (id: string, event: MouseEvent) => {
    event.stopPropagation();
    setTreeExpandedKeys((previous) => ({ ...previous, [id]: !previous[id] }));
  };

  const activeNode = useMemo(() => {
    if (selectedSubNodeId === 'ROOT' || selectedSubNodeId === institution.id) {
      return institution;
    }

    const findNode = (nodes: OrgTreeNode[]): OrgTreeNode | null => {
      for (const node of nodes) {
        if (node.id === selectedSubNodeId) return node;
        if (node.children) {
          const found = findNode(node.children);
          if (found) return found;
        }
      }
      return null;
    };

    return findNode(institution.children || []) || institution;
  }, [institution, selectedSubNodeId]);

  const activeNodeStats = useMemo(() => {
    const countSubBranches = (node: OrgTreeNode): number =>
      (node.children || []).reduce(
        (count, child) => count + 1 + countSubBranches(child),
        0
      );

    return {
      scopeName: activeNode.name,
      isRoot: activeNode.id === institution.id,
      subBranchesCount: countSubBranches(activeNode),
      totalPersonnel: activeNode.totalPersonnel,
      activePersonnel: activeNode.activePersonnel,
      qrLimit: activeNode.qrLimit,
      qrUsed: activeNode.qrUsed,
      todayReports: activeNode.todayReports,
      totalReports: activeNode.totalReports,
      pendingReview: activeNode.pendingReview,
      reviewedToday: activeNode.reviewedToday,
      passRate: activeNode.passRate,
      avgReviewMinutes: activeNode.avgReviewMinutes,
    };
  }, [activeNode, institution]);

  const flatSubBranches = useMemo(() => {
    const branches: OrgTreeNode[] = [];
    const collect = (nodes?: OrgTreeNode[]) => {
      nodes?.forEach((node) => {
        branches.push(node);
        collect(node.children);
      });
    };
    collect(institution.children);
    return branches;
  }, [institution]);

  const relevantPersonnel = useMemo(() => {
    const query = personnelSearch.trim().toLowerCase();
    if (!query) return mockPersonnelList;
    return mockPersonnelList.filter(
      (person) =>
        person.name.toLowerCase().includes(query) ||
        person.phone.toLowerCase().includes(query) ||
        person.subBranchName.toLowerCase().includes(query) ||
        person.role.toLowerCase().includes(query)
    );
  }, [personnelSearch]);

  const relevantEvents = useMemo(
    () =>
      mockReportReviewEvents.filter(
        (event) =>
          (eventCategoryFilter === 'ALL' || event.category === eventCategoryFilter) &&
          (eventStatusFilter === 'ALL' || event.status === eventStatusFilter)
      ),
    [eventCategoryFilter, eventStatusFilter]
  );

  return {
    state: {
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
    },
    actions: {
      setSelectedSubNodeId,
      setTreeSearchQuery,
      setActiveTab,
      setTimeRange,
      setPersonnelSearch,
      setEventCategoryFilter,
      setEventStatusFilter,
      handleRefresh,
      toggleTreeNode,
    },
  };
};
