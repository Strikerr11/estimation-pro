import { WindowCalcResults, DoorCalcResults, BrickworkCalcResults, RCCSlabCalcResults, FlooringCalcResults, PaintCalcResults } from '../types';
import { toInches } from './engine';

export function calculateWindow(params: {
  width: number; height: number; unit: 'ft' | 'in' | 'm' | 'cm' | 'mm';
  num_openings: number; num_mullions: number; num_transoms: number;
  num_special_transoms: number; special_transom_length: number;
  num_special_mullions: number; special_mullion_length: number;
  num_horns: number; horn_length: number;
  timber_thickness: number; timber_width: number;
  material_rate: number;
}): WindowCalcResults {
  const W = toInches(params.width, params.unit);
  const H = toInches(params.height, params.unit);
  const n = params.num_openings;
  const timberSectionArea = (params.timber_thickness * params.timber_width) / 144;

  const headLength = W;
  const sillLength = W;
  const postsLength = 2 * H;
  const transomLength = params.num_transoms * W;
  const mullionLength = params.num_mullions * H;
  const specialTransomLen = params.num_special_transoms * params.special_transom_length;
  const specialMullionLen = params.num_special_mullions * params.special_mullion_length;
  const hornLen = params.num_horns * params.horn_length;

  const totalMemberLengthInches = headLength + sillLength + postsLength + transomLength + mullionLength + specialTransomLen + specialMullionLen + hornLen;
  const totalMemberLengthFt = totalMemberLengthInches / 12;

  const areaPerOpening = (W * H) / 144;
  const perimeterPerOpening = 2 * (W + H) / 12;

  const totalTimberQty = totalMemberLengthFt * n * timberSectionArea;
  const totalArea = areaPerOpening * n;
  const totalPerimeter = perimeterPerOpening * n;

  const materialCost = totalTimberQty * params.material_rate;
  const laborCost = totalArea * 150;
  const totalCost = materialCost + laborCost;

  return {
    window_area: totalArea,
    glass_area: totalArea - (totalMemberLengthFt * n * params.timber_thickness / 12 / 144 * 144),
    frame_length: totalMemberLengthFt,
    head_length: headLength / 12,
    sill_length: sillLength / 12,
    posts_length: postsLength / 12,
    transom_length: transomLength / 12,
    mullion_length: mullionLength / 12,
    special_transom_length: specialTransomLen / 12,
    special_mullion_length: specialMullionLen / 12,
    horn_length: hornLen / 12,
    total_member_length: totalMemberLengthFt,
    area_per_opening: areaPerOpening,
    perimeter_per_opening: perimeterPerOpening,
    timber_section_area: timberSectionArea,
    total_timber_qty: totalTimberQty,
    total_area: totalArea,
    total_perimeter: totalPerimeter,
    material_cost: materialCost,
    labor_cost: laborCost,
    total_cost: totalCost,
  };
}

export function calculateDoor(params: {
  width: number; height: number; quantity: number;
  frame_type: string; shutter_type: string; material_type: string;
  thickness: number; timber_width: number;
  width_unit?: string; thickness_unit?: string;
}): DoorCalcResults {
  const isWidthInInches = 
    params.width_unit === 'in' || 
    params.width_unit === 'Inches (in)' || 
    (params.width > 20 && params.width_unit !== 'ft' && params.width_unit !== 'Feet (ft)');

  const widthFt = isWidthInInches ? params.width / 12 : params.width;
  const heightFt = isWidthInInches ? params.height / 12 : params.height;

  const isThicknessInFt = params.thickness_unit === 'ft' || params.thickness_unit === 'Feet (ft)';
  const thickIn = isThicknessInFt ? params.thickness * 12 : params.thickness;
  const timberWidthIn = isThicknessInFt ? params.timber_width * 12 : params.timber_width;

  const totalArea = widthFt * heightFt * (params.quantity || 1);
  const frameLengthPerDoor = widthFt + (2 * heightFt);
  const totalFrameLength = frameLengthPerDoor * (params.quantity || 1);

  const timberSectionAreaSqFt = (thickIn * timberWidthIn) / 144;
  const timberQtyCft = totalFrameLength * timberSectionAreaSqFt;
  const materialQtyCft = (totalArea * thickIn) / 12;

  const woodRates: Record<string, number> = {
    teak: 2800,
    sal: 2200,
    mango: 1500,
  };
  const timberRate = woodRates[params.material_type?.toLowerCase()] || 2800;

  const shutterRates: Record<string, number> = {
    panelled: 350,
    flush: 250,
    glazed: 400,
  };
  const shutterRate = shutterRates[params.shutter_type?.toLowerCase()] || 350;

  const frameTimberCost = timberQtyCft * timberRate;
  const shutterCost = totalArea * shutterRate;
  const materialCost = frameTimberCost + shutterCost;
  
  const laborCost = totalArea * 150;
  const totalCost = materialCost + laborCost;

  return {
    door_area: totalArea,
    frame_length: totalFrameLength,
    material_quantity: materialQtyCft,
    timber_quantity: timberQtyCft,
    material_cost: materialCost,
    labor_cost: laborCost,
    total_cost: totalCost,
  };
}

export function calculateBrickwork(params: {
  wall_length: number; 
  wall_height: number; 
  wall_thickness: number;
  num_doors: number; 
  num_windows: number;
  door_area?: number; 
  window_area?: number;
}): BrickworkCalcResults {
  const grossArea = params.wall_length * params.wall_height;
  const doorArea = (params.door_area || 21) * params.num_doors;
  const windowArea = (params.window_area || 15) * params.num_windows;
  const deductions = doorArea + windowArea;
  const netArea = Math.max(0, grossArea - deductions);

  const thicknessInFt = params.wall_thickness / 12;
  const wallVolumeCft = netArea * thicknessInFt;

  const totalBricks = Math.ceil(wallVolumeCft * 13.5 * 1.05);

  const dryMortarCft = wallVolumeCft * 0.30;
  const cementBags = Number(((dryMortarCft * (1 / 5)) / 1.25).toFixed(1));
  const sandCft = Number((dryMortarCft * (4 / 5)).toFixed(1));

  const brickCost = totalBricks * 8;
  const cementCost = cementBags * 450;
  const sandCost = sandCft * 45;

  return {
    brick_quantity: totalBricks,
    mortar_volume: Number((dryMortarCft / 1.33).toFixed(2)),
    cement_quantity: cementBags,
    sand_quantity: sandCft,
    cost_estimate: Math.round(brickCost + cementCost + sandCost),
    gross_area: grossArea,
    deductions: deductions,
    net_area: netArea,
  };
}

export function calculateRCCSlab(params: {
  length: number; width: number; thickness: number;
}): RCCSlabCalcResults {
  const concreteVolume = (params.length * params.width * params.thickness) / 12;
  const dryVolume = concreteVolume * 1.54;

  const cementRatio = 1, sandRatio = 1.5, aggregateRatio = 3;
  const totalRatio = cementRatio + sandRatio + aggregateRatio;

  const dryVolumeCuM = dryVolume / 35.3147;
  const cementVolumeCuM = dryVolumeCuM * (cementRatio / totalRatio);
  const cementBags = (cementVolumeCuM * 1440) / 50;

  const sandQtyCft = dryVolume * (sandRatio / totalRatio);
  const aggregateQtyCft = dryVolume * (aggregateRatio / totalRatio);

  const steelQty = concreteVolume * 7850 * 0.01 * 0.0283168;
  const formworkArea = params.length * params.width;

  const cementCost = cementBags * 450;
  const sandCost = sandQtyCft * 45;
  const aggregateCost = aggregateQtyCft * 55;
  const steelCost = steelQty * 62;
  const formworkCost = formworkArea * 80;

  return {
    concrete_volume: concreteVolume,
    cement_bags: Math.ceil(cementBags * 10) / 10,
    sand_quantity: Math.ceil(sandQtyCft * 10) / 10,
    aggregate_quantity: Math.ceil(aggregateQtyCft * 10) / 10,
    steel_quantity: Math.ceil(steelQty * 10) / 10,
    cost_estimate: cementCost + sandCost + aggregateCost + steelCost + formworkCost,
    formwork_area: formworkArea,
  };
}

export function calculateFlooring(params: {
  length: number; width: number; tile_size: number; tile_rate: number;
}): FlooringCalcResults {
  const floorArea = params.length * params.width;
  const tileSizeSqFt = params.tile_size * params.tile_size / 144;
  const numTiles = Math.ceil(floorArea / tileSizeSqFt);
  const wastage = Math.ceil(numTiles * 0.10);
  const totalTiles = numTiles + wastage;
  const totalCost = totalTiles * params.tile_rate;

  return {
    floor_area: floorArea,
    num_tiles: numTiles,
    wastage: wastage,
    total_tiles: totalTiles,
    total_cost: totalCost,
  };
}

export function calculatePaint(params: {
  length: number; width: number; height: number; paint_coverage: number;
}): PaintCalcResults {
  const wallArea = 2 * (params.length + params.width) * params.height;
  const ceilingArea = params.length * params.width;
  const totalArea = wallArea + ceilingArea;
  const paintQty = totalArea / params.paint_coverage;
  const primerQty = totalArea / 40;
  const paintCost = paintQty * 320 + primerQty * 180;

  return {
    wall_area: wallArea,
    ceiling_area: ceilingArea,
    total_area: totalArea,
    paint_quantity: Math.ceil(paintQty * 10) / 10,
    primer_quantity: Math.ceil(primerQty * 10) / 10,
    paint_cost: paintCost,
  };
}