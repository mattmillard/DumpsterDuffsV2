import { supabaseAdmin } from "@/lib/supabase/admin";

const BUCKET = "admin-config";

type PricingItem = {
  id: string;
  name: string;
  size_yards: number;
  price_base: number;
  price_per_day: number;
  is_active: boolean;
};

type ServiceZone = {
  id: string;
  name: string;
  zone_type: string;
  delivery_fee: number;
  is_active: boolean;
};

type InventoryItem = {
  id: string;
  name: string;
  total_units: number;
  available_units: number;
  is_active: boolean;
};

const DEFAULT_PRICING: PricingItem[] = [
  {
    id: "size-15",
    name: "15 Yard",
    size_yards: 15,
    price_base: 349.99,
    price_per_day: 30,
    is_active: true,
  },
];

const DEFAULT_ZONES: ServiceZone[] = [
  {
    id: crypto.randomUUID(),
    name: "Columbia Metro",
    zone_type: "Zipcode",
    delivery_fee: 49.99,
    is_active: true,
  },
  {
    id: crypto.randomUUID(),
    name: "Jefferson City Area",
    zone_type: "Zipcode",
    delivery_fee: 59.99,
    is_active: true,
  },
];

const DEFAULT_INVENTORY: InventoryItem[] = [
  {
    id: crypto.randomUUID(),
    name: "15 Yard",
    total_units: 12,
    available_units: 9,
    is_active: true,
  },
];

async function ensureBucket() {
  const { data: buckets, error: listError } =
    await supabaseAdmin.storage.listBuckets();

  if (listError) {
    throw listError;
  }

  const exists = buckets?.some((bucket) => bucket.name === BUCKET);
  if (exists) {
    return;
  }

  const { error: createError } = await supabaseAdmin.storage.createBucket(
    BUCKET,
    {
      public: false,
      fileSizeLimit: "1MB",
    },
  );

  if (
    createError &&
    !createError.message.toLowerCase().includes("already exists")
  ) {
    throw createError;
  }
}

async function readConfigFile<T>(path: string, defaultData: T): Promise<T> {
  await ensureBucket();

  const { data, error } = await supabaseAdmin.storage
    .from(BUCKET)
    .download(path);

  if (error || !data) {
    await writeConfigFile(path, defaultData);
    return defaultData;
  }

  const text = await data.text();
  if (!text) {
    await writeConfigFile(path, defaultData);
    return defaultData;
  }

  return JSON.parse(text) as T;
}

async function writeConfigFile<T>(path: string, value: T): Promise<void> {
  await ensureBucket();

  const { error } = await supabaseAdmin.storage
    .from(BUCKET)
    .upload(path, JSON.stringify(value), {
      contentType: "application/json",
      upsert: true,
    });

  if (error) {
    throw error;
  }
}

export async function getPricingConfig() {
  return readConfigFile<PricingItem[]>("pricing.json", DEFAULT_PRICING);
}

export async function setPricingConfig(value: PricingItem[]) {
  return writeConfigFile("pricing.json", value);
}

export async function getZonesConfig() {
  return readConfigFile<ServiceZone[]>("zones.json", DEFAULT_ZONES);
}

export async function setZonesConfig(value: ServiceZone[]) {
  return writeConfigFile("zones.json", value);
}

export async function getInventoryConfig() {
  return readConfigFile<InventoryItem[]>("inventory.json", DEFAULT_INVENTORY);
}

export async function setInventoryConfig(value: InventoryItem[]) {
  return writeConfigFile("inventory.json", value);
}

export type { PricingItem, ServiceZone, InventoryItem };
