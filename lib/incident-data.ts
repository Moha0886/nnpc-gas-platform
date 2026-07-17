// Incident Reporting Data Model and Mock Data

export type IncidentStatus = "open" | "under-investigation" | "resolved" | "closed";
export type IncidentSeverity = "critical" | "high" | "medium" | "low";
export type IncidentCategory =
  | "pipeline-leak"
  | "equipment-failure"
  | "pressure-excursion"
  | "vandalism"
  | "fire"
  | "environmental"
  | "safety"
  | "maintenance"
  | "operational";

export type FacilityType =
  | "pipeline"
  | "compressor"
  | "processing-plant"
  | "metering-station"
  | "terminal"
  | "storage";

export interface Incident {
  id: string;
  title: string;
  description: string;
  category: IncidentCategory;
  severity: IncidentSeverity;
  status: IncidentStatus;
  facilityType: FacilityType;
  facilityId: string;
  facilityName: string;
  location: {
    coordinates: [number, number]; // [lng, lat]
    address?: string;
  };
  corridor: string;
  dateReported: string;
  dateOccurred: string;
  dateResolved?: string;
  reportedBy: string;
  assignedTo?: string;
  deferment: number; // MMscf/d
  estimatedLoss: number; // USD
  images: string[];
  remarks: string[];
  hseImpact?: {
    injuries: number;
    fatalities: number;
    environmentalDamage: boolean;
  };
  rootCause?: string;
  correctiveActions?: string[];
}

// Mock Incident Data
export const incidents: Incident[] = [
  {
    id: "inc-001",
    title: "Pipeline Vandalism - OB3 Line",
    description:
      "Suspected vandalism detected on OB3 pipeline at KP 45. Hot tap observed with gas leak. Line isolated for repairs.",
    category: "vandalism",
    severity: "critical",
    status: "under-investigation",
    facilityType: "pipeline",
    facilityId: "ob3",
    facilityName: "OB3 (Oben-Escravos Pipeline)",
    location: {
      coordinates: [5.2, 6.2],
      address: "KP 45, Ughelli area",
    },
    corridor: "Eastern",
    dateReported: "2026-07-15T08:30:00Z",
    dateOccurred: "2026-07-15T06:00:00Z",
    reportedBy: "Field Operator - Ughelli Station",
    assignedTo: "Security & Integrity Team",
    deferment: 25.0,
    estimatedLoss: 125000,
    images: ["/incidents/ob3-vandalism.jpg"],
    remarks: [
      "Security team dispatched to location",
      "Line pressure reduced to zero",
      "Community leaders engaged",
      "Repair crew mobilized",
    ],
    hseImpact: {
      injuries: 0,
      fatalities: 0,
      environmentalDamage: true,
    },
  },
  {
    id: "inc-002",
    title: "Compressor Station Failure - Bonny Plant",
    description:
      "Compressor unit CS-02 at Bonny plant experienced bearing failure. Unit shut down for bearing replacement. Reduced throughput.",
    category: "equipment-failure",
    severity: "high",
    status: "open",
    facilityType: "processing-plant",
    facilityId: "plant-bonny",
    facilityName: "Bonny Gas Plant (NLNG Feed)",
    location: {
      coordinates: [7.033, 4.816],
      address: "Bonny Island, Rivers State",
    },
    corridor: "Eastern",
    dateReported: "2026-07-14T14:20:00Z",
    dateOccurred: "2026-07-14T12:00:00Z",
    reportedBy: "Plant Supervisor - Bonny",
    assignedTo: "Mechanical Maintenance Team",
    deferment: 50.0,
    estimatedLoss: 300000,
    images: ["/incidents/bonny-compressor.jpg"],
    remarks: [
      "Bearing ordered from supplier",
      "ETA 5 days for spare parts",
      "Running on standby compressor at reduced capacity",
      "Vibration analysis completed",
    ],
    hseImpact: {
      injuries: 0,
      fatalities: 0,
      environmentalDamage: false,
    },
    rootCause: "Bearing wear due to extended operation beyond maintenance schedule",
    correctiveActions: [
      "Replace bearing on CS-02",
      "Review preventive maintenance schedule",
      "Implement condition-based monitoring",
    ],
  },
  {
    id: "inc-003",
    title: "Pressure Excursion - Trans-Niger Pipeline",
    description:
      "Pressure spike detected at metering station MS-TN-03. Upstream valve malfunction caused pressure to exceed MAOP by 8%.",
    category: "pressure-excursion",
    severity: "high",
    status: "resolved",
    facilityType: "pipeline",
    facilityId: "trans-niger",
    facilityName: "Trans-Niger Pipeline",
    location: {
      coordinates: [7.15, 5.0],
      address: "Metering Station MS-TN-03",
    },
    corridor: "Eastern",
    dateReported: "2026-07-10T09:15:00Z",
    dateOccurred: "2026-07-10T09:00:00Z",
    dateResolved: "2026-07-11T16:00:00Z",
    reportedBy: "Control Room Operator",
    assignedTo: "Instrumentation Team",
    deferment: 0,
    estimatedLoss: 0,
    images: ["/incidents/pressure-excursion.jpg"],
    remarks: [
      "Automatic pressure relief valve activated",
      "Line pressure returned to normal",
      "Valve replaced and tested",
      "Integrity inspection completed - no damage",
    ],
    hseImpact: {
      injuries: 0,
      fatalities: 0,
      environmentalDamage: false,
    },
    rootCause: "Upstream control valve actuator failure",
    correctiveActions: [
      "Replace faulty valve actuator",
      "Calibrate all pressure control valves on the line",
      "Review SCADA alarm settings",
    ],
  },
  {
    id: "inc-004",
    title: "Routine Maintenance - Escravos Plant",
    description:
      "Scheduled turnaround maintenance at Escravos gas plant. Processing train PT-1 offline for 72 hours.",
    category: "maintenance",
    severity: "medium",
    status: "closed",
    facilityType: "processing-plant",
    facilityId: "plant-escravos",
    facilityName: "Escravos Gas Plant",
    location: {
      coordinates: [5.76, 5.52],
      address: "Escravos, Delta State",
    },
    corridor: "Eastern",
    dateReported: "2026-07-05T00:00:00Z",
    dateOccurred: "2026-07-05T00:00:00Z",
    dateResolved: "2026-07-08T00:00:00Z",
    reportedBy: "Maintenance Manager - Escravos",
    assignedTo: "Turnaround Team",
    deferment: 0,
    estimatedLoss: 0,
    images: ["/incidents/escravos-maintenance.jpg"],
    remarks: [
      "Scheduled maintenance completed successfully",
      "All inspection items closed",
      "Plant back online ahead of schedule",
      "No integrity issues found",
    ],
    hseImpact: {
      injuries: 0,
      fatalities: 0,
      environmentalDamage: false,
    },
  },
  {
    id: "inc-005",
    title: "Gas Leak - Metering Station Ijora",
    description:
      "Minor gas leak detected at Ijora metering station flange connection. Station isolated, leak stopped, repairs underway.",
    category: "pipeline-leak",
    severity: "medium",
    status: "resolved",
    facilityType: "metering-station",
    facilityId: "meter-ijora",
    facilityName: "Ijora Metering Station",
    location: {
      coordinates: [3.39, 6.455],
      address: "Ijora, Lagos",
    },
    corridor: "Lagos",
    dateReported: "2026-07-12T11:00:00Z",
    dateOccurred: "2026-07-12T10:45:00Z",
    dateResolved: "2026-07-12T18:00:00Z",
    reportedBy: "Station Operator - Ijora",
    assignedTo: "Emergency Response Team",
    deferment: 0,
    estimatedLoss: 5000,
    images: ["/incidents/ijora-leak.jpg"],
    remarks: [
      "Area evacuated as precaution",
      "Flange gasket replaced",
      "Leak test completed - all clear",
      "Station back in service",
    ],
    hseImpact: {
      injuries: 0,
      fatalities: 0,
      environmentalDamage: false,
    },
    rootCause: "Degraded flange gasket",
    correctiveActions: [
      "Replace all flanges on same vintage",
      "Implement leak detection system upgrade",
    ],
  },
];

// Utility functions
export const getIncidentsByStatus = (status: IncidentStatus) => {
  return incidents.filter((incident) => incident.status === status);
};

export const getIncidentsBySeverity = (severity: IncidentSeverity) => {
  return incidents.filter((incident) => incident.severity === severity);
};

export const getIncidentsByFacility = (facilityId: string) => {
  return incidents.filter((incident) => incident.facilityId === facilityId);
};

export const getTotalDefermentFromIncidents = () => {
  return incidents.reduce((sum, incident) => sum + incident.deferment, 0);
};

export const getTotalEstimatedLoss = () => {
  return incidents.reduce((sum, incident) => sum + incident.estimatedLoss, 0);
};

export const getActiveIncidents = () => {
  return incidents.filter(
    (incident) => incident.status === "open" || incident.status === "under-investigation"
  );
};

export const getCriticalIncidents = () => {
  return incidents.filter(
    (incident) =>
      incident.severity === "critical" &&
      (incident.status === "open" || incident.status === "under-investigation")
  );
};

// Statistics
export const getIncidentStats = () => {
  return {
    total: incidents.length,
    open: getIncidentsByStatus("open").length,
    underInvestigation: getIncidentsByStatus("under-investigation").length,
    resolved: getIncidentsByStatus("resolved").length,
    closed: getIncidentsByStatus("closed").length,
    critical: getIncidentsBySeverity("critical").length,
    high: getIncidentsBySeverity("high").length,
    medium: getIncidentsBySeverity("medium").length,
    low: getIncidentsBySeverity("low").length,
    totalDeferment: getTotalDefermentFromIncidents(),
    totalLoss: getTotalEstimatedLoss(),
  };
};
