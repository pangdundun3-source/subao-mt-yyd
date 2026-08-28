import React, { useState, useEffect } from 'react';
import { OrgTreeNode, mockPlatformOrgTreeData } from './operations/monitoringData';
import { PlatformInstitutionsHub } from './operations/PlatformInstitutionsHub';
import { SingleInstitutionMonitoring } from './operations/SingleInstitutionMonitoring';

export const OperationsMonitoring: React.FC = () => {
  // Active selected institution ID for detailed monitoring, null = Platform Hub
  const [selectedInstId, setSelectedInstId] = useState<string | null>(() => {
    const saved = localStorage.getItem('admin_ops_selected_inst_id');
    return saved && saved !== 'null' ? saved : null;
  });

  useEffect(() => {
    localStorage.setItem('admin_ops_selected_inst_id', selectedInstId ? selectedInstId : 'null');
  }, [selectedInstId]);

  // Find currently selected institution
  const selectedInstitution = selectedInstId
    ? mockPlatformOrgTreeData.find((inst) => inst.id === selectedInstId) || null
    : null;

  const handleSelectInstitution = (inst: OrgTreeNode) => {
    setSelectedInstId(inst.id);
  };

  const handleBackToHub = () => {
    setSelectedInstId(null);
  };

  const handleSwitchInstitution = (inst: OrgTreeNode) => {
    setSelectedInstId(inst.id);
  };

  return (
    <div className="space-y-6">
      {selectedInstitution ? (
        <SingleInstitutionMonitoring
          institution={selectedInstitution}
          onBackToHub={handleBackToHub}
          onSwitchInstitution={handleSwitchInstitution}
        />
      ) : (
        <PlatformInstitutionsHub onSelectInstitution={handleSelectInstitution} />
      )}
    </div>
  );
};
