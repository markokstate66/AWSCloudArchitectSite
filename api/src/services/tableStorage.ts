import { TableClient, TableEntity, odata } from "@azure/data-tables";

const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING || "";

// Table clients
const productsTable = TableClient.fromConnectionString(connectionString, "Products");
const variantsTable = TableClient.fromConnectionString(connectionString, "Variants");
const dailyStatsTable = TableClient.fromConnectionString(connectionString, "DailyStats");

// Interfaces
export interface Product extends TableEntity {
  slotName: string;
  isActive: boolean;
  createdAt: string;
}

export interface Variant extends TableEntity {
  title: string;
  author: string;
  description: string;
  amazonUrl: string;
  imageUrl?: string;
  tags: string; // JSON array
  isActive: boolean;
  weight: number;
  createdAt: string;
  droppedAt?: string;
  dropReason?: string;
}

export interface DailyStat extends TableEntity {
  impressions: number;
  clicks: number;
  ctr: number;
}

// Helper to get today's date string
export function getTodayString(): string {
  return new Date().toISOString().split("T")[0];
}

// Products operations
export async function getActiveProducts(): Promise<Product[]> {
  const products: Product[] = [];
  const entities = productsTable.listEntities<Product>({
    queryOptions: { filter: odata`isActive eq true` }
  });
  for await (const entity of entities) {
    products.push(entity);
  }
  return products;
}

export async function createProduct(slotId: string, slotName: string): Promise<void> {
  await productsTable.createEntity({
    partitionKey: "products",
    rowKey: slotId,
    slotName,
    isActive: true,
    createdAt: new Date().toISOString()
  });
}

// Variants operations
export async function getActiveVariantsForSlot(slotId: string): Promise<Variant[]> {
  const variants: Variant[] = [];
  const entities = variantsTable.listEntities<Variant>({
    queryOptions: { filter: odata`PartitionKey eq ${slotId} and isActive eq true` }
  });
  for await (const entity of entities) {
    variants.push(entity);
  }
  return variants;
}

export async function getAllVariantsForSlot(slotId: string): Promise<Variant[]> {
  const variants: Variant[] = [];
  const entities = variantsTable.listEntities<Variant>({
    queryOptions: { filter: odata`PartitionKey eq ${slotId}` }
  });
  for await (const entity of entities) {
    variants.push(entity);
  }
  return variants;
}

export async function createVariant(
  slotId: string,
  variantId: string,
  data: {
    title: string;
    author: string;
    description: string;
    amazonUrl: string;
    imageUrl?: string;
    tags: string[];
  }
): Promise<void> {
  await variantsTable.createEntity({
    partitionKey: slotId,
    rowKey: variantId,
    title: data.title,
    author: data.author,
    description: data.description,
    amazonUrl: data.amazonUrl,
    imageUrl: data.imageUrl || "",
    tags: JSON.stringify(data.tags),
    isActive: true,
    weight: 100,
    createdAt: new Date().toISOString()
  });
}

export async function updateVariantWeight(slotId: string, variantId: string, weight: number): Promise<void> {
  const entity = await variantsTable.getEntity<Variant>(slotId, variantId);
  await variantsTable.updateEntity({
    ...entity,
    weight
  }, "Merge");
}

export async function dropVariant(slotId: string, variantId: string, reason: string): Promise<void> {
  const entity = await variantsTable.getEntity<Variant>(slotId, variantId);
  await variantsTable.updateEntity({
    ...entity,
    isActive: false,
    weight: 0,
    droppedAt: new Date().toISOString(),
    dropReason: reason
  }, "Merge");
}

// DailyStats operations
export async function incrementImpression(variantId: string): Promise<void> {
  const today = getTodayString();
  try {
    const entity = await dailyStatsTable.getEntity<DailyStat>(variantId, today);
    const impressions = (entity.impressions || 0) + 1;
    const clicks = entity.clicks || 0;
    await dailyStatsTable.updateEntity({
      ...entity,
      impressions,
      ctr: clicks > 0 ? (clicks / impressions) * 100 : 0
    }, "Merge");
  } catch (error: any) {
    if (error.statusCode === 404) {
      await dailyStatsTable.createEntity({
        partitionKey: variantId,
        rowKey: today,
        impressions: 1,
        clicks: 0,
        ctr: 0
      });
    } else {
      throw error;
    }
  }
}

export async function incrementClick(variantId: string): Promise<void> {
  const today = getTodayString();
  try {
    const entity = await dailyStatsTable.getEntity<DailyStat>(variantId, today);
    const clicks = (entity.clicks || 0) + 1;
    const impressions = entity.impressions || 1;
    await dailyStatsTable.updateEntity({
      ...entity,
      clicks,
      ctr: (clicks / impressions) * 100
    }, "Merge");
  } catch (error: any) {
    if (error.statusCode === 404) {
      await dailyStatsTable.createEntity({
        partitionKey: variantId,
        rowKey: today,
        impressions: 1,
        clicks: 1,
        ctr: 100
      });
    } else {
      throw error;
    }
  }
}

export async function getStatsForVariant(variantId: string, days: number = 7): Promise<DailyStat[]> {
  const stats: DailyStat[] = [];
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);
  const cutoffString = cutoffDate.toISOString().split("T")[0];

  const entities = dailyStatsTable.listEntities<DailyStat>({
    queryOptions: { filter: odata`PartitionKey eq ${variantId} and RowKey ge ${cutoffString}` }
  });

  for await (const entity of entities) {
    stats.push(entity);
  }
  return stats;
}

export async function getTotalImpressions(variantId: string): Promise<number> {
  let total = 0;
  const entities = dailyStatsTable.listEntities<DailyStat>({
    queryOptions: { filter: odata`PartitionKey eq ${variantId}` }
  });
  for await (const entity of entities) {
    total += entity.impressions || 0;
  }
  return total;
}

// Weighted random selection
export function selectVariantWeighted(variants: Variant[]): Variant {
  const activeVariants = variants.filter(v => v.isActive);
  if (activeVariants.length === 0) throw new Error("No active variants");
  if (activeVariants.length === 1) return activeVariants[0];

  const totalWeight = activeVariants.reduce((sum, v) => sum + (v.weight || 100), 0);
  let random = Math.random() * totalWeight;

  for (const variant of activeVariants) {
    random -= (variant.weight || 100);
    if (random <= 0) return variant;
  }

  return activeVariants[activeVariants.length - 1];
}

// Calculate rolling CTR
export function calculateRollingCTR(stats: DailyStat[]): number {
  const totalImpressions = stats.reduce((sum, s) => sum + (s.impressions || 0), 0);
  const totalClicks = stats.reduce((sum, s) => sum + (s.clicks || 0), 0);
  if (totalImpressions === 0) return 0;
  return (totalClicks / totalImpressions) * 100;
}
