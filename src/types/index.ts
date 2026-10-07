export type UserRole = 'estimator' | 'engineer' | 'surveyor' | 'admin';
export type ProjectType = 'residential' | 'commercial' | 'industrial';
export type UnitSystem = 'metric' | 'imperial';
export type LengthUnit = 'ft' | 'in' | 'm' | 'cm' | 'mm';
export type Theme = 'dark' | 'light';

export interface User {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  company?: string;
  avatar_url?: string;
  created_at: string;
}

export interface Project {
  id: string;
  user_id: string | null;
  name: string;
  client_name: string;
  location: string;
  engineer_name: string;
  project_type: ProjectType;
  date: string;
  notes: string;
  status: 'draft' | 'in_progress' | 'completed';
  total_cost: number;
  created_at: string;
  updated_at: string;
}

export interface WindowEstimate {
  id: string;
  project_id: string;
  name: string;
  width: number;
  height: number;
  unit: LengthUnit;
  num_openings: number;
  frame_material: string;
  num_mullions: number;
  num_transoms: number;
  num_special_transoms: number;
  special_transom_length: number;
  num_special_mullions: number;
  special_mullion_length: number;
  num_horns: number;
  horn_length: number;
  timber_thickness: number;
  timber_width: number;
  sill_level: number;
  head_level: number;
  material_rate: number;
  results?: WindowCalcResults;
}

export interface WindowCalcResults {
  window_area: number;
  glass_area: number;
  frame_length: number;
  head_length: number;
  sill_length: number;
  posts_length: number;
  transom_length: number;
  mullion_length: number;
  special_transom_length: number;
  special_mullion_length: number;
  horn_length: number;
  total_member_length: number;
  area_per_opening: number;
  perimeter_per_opening: number;
  timber_section_area: number;
  total_timber_qty: number;
  total_area: number;
  total_perimeter: number;
  material_cost: number;
  labor_cost: number;
  total_cost: number;
}

export interface DoorEstimate {
  id: string;
  project_id: string;
  name: string;
  width: number;
  height: number;
  quantity: number;
  frame_type: string;
  shutter_type: string;
  material_type: string;
  thickness: number;
  timber_width: number;
  results?: DoorCalcResults;
}

export interface DoorCalcResults {
  door_area: number;
  frame_length: number;
  material_quantity: number;
  timber_quantity: number;
  material_cost: number;
  labor_cost: number;
  total_cost: number;
}

export interface BrickworkEstimate {
  id: string;
  project_id: string;
  name: string;
  wall_length: number;
  wall_height: number;
  wall_thickness: number;
  num_doors: number;
  num_windows: number;
  results?: BrickworkCalcResults;
}

export interface BrickworkCalcResults {
  brick_quantity: number;
  mortar_volume: number;
  cement_quantity: number;
  sand_quantity: number;
  cost_estimate: number;
  gross_area: number;
  deductions: number;
  net_area: number;
}

export interface RCCSlabEstimate {
  id: string;
  project_id: string;
  name: string;
  length: number;
  width: number;
  thickness: number;
  results?: RCCSlabCalcResults;
}

export interface RCCSlabCalcResults {
  concrete_volume: number;
  cement_bags: number;
  sand_quantity: number;
  aggregate_quantity: number;
  steel_quantity: number;
  cost_estimate: number;
  formwork_area: number;
}

export interface FlooringEstimate {
  id: string;
  project_id: string;
  name: string;
  length: number;
  width: number;
  tile_size: number;
  tile_rate: number;
  results?: FlooringCalcResults;
}

export interface FlooringCalcResults {
  floor_area: number;
  num_tiles: number;
  wastage: number;
  total_tiles: number;
  total_cost: number;
}

export interface PaintEstimate {
  id: string;
  project_id: string;
  name: string;
  length: number;
  width: number;
  height: number;
  paint_coverage: number;
  results?: PaintCalcResults;
}

export interface PaintCalcResults {
  wall_area: number;
  ceiling_area: number;
  total_area: number;
  paint_quantity: number;
  primer_quantity: number;
  paint_cost: number;
}

export interface MaterialRate {
  id: string;
  name: string;
  category: string;
  unit: string;
  rate: number;
  updated_at: string;
}

export interface BOQItem {
  id: string;
  item_no: number;
  item: string;
  description: string;
  unit: string;
  quantity: number;
  rate: number;
  amount: number;
}

export interface BOQ {
  id: string;
  project_id: string;
  name: string;
  items: BOQItem[];
  material_cost: number;
  labor_cost: number;
  transportation_cost: number;
  machinery_cost: number;
  miscellaneous: number;
  subtotal: number;
  tax_percent: number;
  tax_amount: number;
  grand_total: number;
  created_at: string;
}

export interface CostBreakdown {
  material_cost: number;
  labor_cost: number;
  transportation_cost: number;
  machinery_cost: number;
  miscellaneous: number;
  subtotal: number;
  tax_percent: number;
  tax_amount: number;
  grand_total: number;
}

export type EstimateType = 'window' | 'door' | 'brickwork' | 'rcc_slab' | 'flooring' | 'paint';

export interface EstimateRecord {
  id: string;
  project_id: string;
  type: EstimateType;
  name: string;
  data: Record<string, unknown>;
  results: Record<string, unknown>;
  created_at: string;
}
