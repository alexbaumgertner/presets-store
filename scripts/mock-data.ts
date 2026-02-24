import { Types } from "mongoose";

const STUB_BASE_URL = "http://example.com"

export interface MockUser {
  email: string;
  role: "user" | "admin";
}

export interface MockPreset {
  title: string;
  description: string;
  processorType: string;
  tags: string[];
  price: number;
  previewAudioUrl: string;
  presetFileUrl: string;
  coverImageUrl: string;
  authorId: string; // Will be replaced with actual ObjectId
  isPublished: boolean;
}

export interface MockOrder {
  userId: string; // Will be replaced with actual ObjectId
  presets: string[]; // Will be replaced with actual ObjectIds
  totalPrice: number;
  stripeSessionId: string;
  status: "pending" | "paid" | "failed";
}

export interface MockDownloadToken {
  presetId: string; // Will be replaced with actual ObjectId
  userId: string; // Will be replaced with actual ObjectId
  expiresAt: Date;
}

export const mockUsers: MockUser[] = [
  {
    email: "admin@example.com",
    role: "admin"
  },
  {
    email: "user1@example.com",
    role: "user"
  },
  {
    email: "user2@example.com",
    role: "user"
  },
  {
    email: "user3@example.com",
    role: "user"
  }
];

export const mockPresets: Omit<MockPreset, "authorId">[] = [
  {
    title: "Heavy Rhythm Crunch",
    description: "A powerful rhythm tone with tight low-end and aggressive mid-range. Perfect for modern metal and hard rock.",
    processorType: "Helix",
    tags: ["metal", "rhythm", "crunch", "heavy"],
    price: 9.99,
    previewAudioUrl: `${STUB_BASE_URL}/files/previews/heavy-rhythm.mp3`,
    presetFileUrl: `${STUB_BASE_URL}/files/presets/heavy-rhythm.hlx`,
    coverImageUrl: `${STUB_BASE_URL}/files/covers/heavy-rhythm.jpg`,
    isPublished: true
  },
  {
    title: "Clean Chorus Delight",
    description: "Sparkling clean tone with lush chorus modulation. Ideal for pop, country, and ambient styles.",
    processorType: "Kemper",
    tags: ["clean", "chorus", "ambient", "pop"],
    price: 7.99,
    previewAudioUrl: `${STUB_BASE_URL}/files/previews/clean-chorus.mp3`,
    presetFileUrl: `${STUB_BASE_URL}/files/presets/clean-chorus.kpa`,
    coverImageUrl: `${STUB_BASE_URL}/files/covers/clean-chorus.jpg`,
    isPublished: true
  },
  {
    title: "Lead Solo Hero",
    description: "Screaming lead tone with singing sustain and perfect note definition. Cut through any mix.",
    processorType: "Quad Cortex",
    tags: ["lead", "solo", "high-gain", "sustain"],
    price: 12.99,
    previewAudioUrl: `${STUB_BASE_URL}/files/previews/lead-solo.mp3`,
    presetFileUrl: `${STUB_BASE_URL}/files/presets/lead-solo.cync`,
    coverImageUrl: `${STUB_BASE_URL}/files/covers/lead-solo.jpg`,
    isPublished: true
  },
  {
    title: "Ambient Pad Dream",
    description: "Ethereal ambient tones with reverb and delay. Perfect for soundscapes and atmospheric textures.",
    processorType: "Neural DSP",
    tags: ["ambient", "reverb", "delay", "atmospheric"],
    price: 8.99,
    previewAudioUrl: `${STUB_BASE_URL}/files/previews/ambient-pad.mp3`,
    presetFileUrl: `${STUB_BASE_URL}/files/presets/ambient-pad.plugin`,
    coverImageUrl: `${STUB_BASE_URL}/files/covers/ambient-pad.jpg`,
    isPublished: true
  },
  {
    title: "Vintage Blues Drive",
    description: "Classic blues tone with smooth overdrive. Inspired by the greats of blues and classic rock.",
    processorType: "Axe-Fx",
    tags: ["blues", "vintage", "overdrive", "classic"],
    price: 6.99,
    previewAudioUrl: `${STUB_BASE_URL}/files/previews/vintage-blues.mp3`,
    presetFileUrl: `${STUB_BASE_URL}/files/presets/vintage-blues.syx`,
    coverImageUrl: `${STUB_BASE_URL}/files/covers/vintage-blues.jpg`,
    isPublished: true
  },
  {
    title: "Modern Djent Machine",
    description: "Ultra-tight djent tone with massive low-end and percussive attack. For modern progressive metal.",
    processorType: "Helix",
    tags: ["djent", "modern", "progressive", "tight"],
    price: 14.99,
    previewAudioUrl: `${STUB_BASE_URL}/files/previews/djent-machine.mp3`,
    presetFileUrl: `${STUB_BASE_URL}/files/presets/djent-machine.hlx`,
    coverImageUrl: `${STUB_BASE_URL}/files/covers/djent-machine.jpg`,
    isPublished: true
  },
  {
    title: "Jazz Clean Warmth",
    description: "Warm, round jazz tone with natural compression. Perfect for jazz, fusion, and smooth styles.",
    processorType: "Kemper",
    tags: ["jazz", "clean", "warm", "fusion"],
    price: 5.99,
    previewAudioUrl: `${STUB_BASE_URL}/files/previews/jazz-clean.mp3`,
    presetFileUrl: `${STUB_BASE_URL}/files/presets/jazz-clean.kpa`,
    coverImageUrl: `${STUB_BASE_URL}/files/covers/jazz-clean.jpg`,
    isPublished: true
  },
  {
    title: "80s Hair Metal",
    description: "Big, bold 80s rock tone with chorus and reverb. Channel your inner rockstar.",
    processorType: "Quad Cortex",
    tags: ["80s", "rock", "hair-metal", "chorus"],
    price: 9.99,
    previewAudioUrl: `${STUB_BASE_URL}/files/previews/hair-metal.mp3`,
    presetFileUrl: `${STUB_BASE_URL}/files/presets/hair-metal.cync`,
    coverImageUrl: `${STUB_BASE_URL}/files/covers/hair-metal.jpg`,
    isPublished: true
  },
  {
    title: "Acoustic Simulator",
    description: "Realistic acoustic guitar simulation. Great for when you need acoustic tones from an electric.",
    processorType: "Neural DSP",
    tags: ["acoustic", "simulation", "versatile"],
    price: 11.99,
    previewAudioUrl: `${STUB_BASE_URL}/files/previews/acoustic-sim.mp3`,
    presetFileUrl: `${STUB_BASE_URL}/files/presets/acoustic-sim.plugin`,
    coverImageUrl: `${STUB_BASE_URL}/files/covers/acoustic-sim.jpg`,
    isPublished: true
  },
  {
    title: "High Gain Monster",
    description: "Extreme high-gain tone with brutal distortion. For the heaviest of metal genres.",
    processorType: "Axe-Fx",
    tags: ["high-gain", "metal", "brutal", "extreme"],
    price: 13.99,
    previewAudioUrl: `${STUB_BASE_URL}/files/previews/high-gain.mp3`,
    presetFileUrl: `${STUB_BASE_URL}/files/presets/high-gain.syx`,
    coverImageUrl: `${STUB_BASE_URL}/files/covers/high-gain.jpg`,
    isPublished: true
  },
  {
    title: "Country Twang",
    description: "Classic country tone with bright twang and subtle compression. Perfect for country and western styles.",
    processorType: "Helix",
    tags: ["country", "twang", "bright", "classic"],
    price: 7.99,
    previewAudioUrl: `${STUB_BASE_URL}/files/previews/country-twang.mp3`,
    presetFileUrl: `${STUB_BASE_URL}/files/presets/country-twang.hlx`,
    coverImageUrl: `${STUB_BASE_URL}/files/covers/country-twang.jpg`,
    isPublished: false
  },
  {
    title: "Shoegaze Wall",
    description: "Massive wall of sound with layers of reverb and delay. For shoegaze and post-rock.",
    processorType: "Kemper",
    tags: ["shoegaze", "reverb", "delay", "wall-of-sound"],
    price: 10.99,
    previewAudioUrl: `${STUB_BASE_URL}/files/previews/shoegaze-wall.mp3`,
    presetFileUrl: `${STUB_BASE_URL}/files/presets/shoegaze-wall.kpa`,
    coverImageUrl: `${STUB_BASE_URL}/files/covers/shoegaze-wall.jpg`,
    isPublished: false
  },
  {
    title: "Funk Rhythm Groove",
    description: "Tight, percussive funk tone with clean attack. Get your groove on.",
    processorType: "Quad Cortex",
    tags: ["funk", "rhythm", "groove", "percussive"],
    price: 8.99,
    previewAudioUrl: `${STUB_BASE_URL}/files/previews/funk-groove.mp3`,
    presetFileUrl: `${STUB_BASE_URL}/files/presets/funk-groove.cync`,
    coverImageUrl: `${STUB_BASE_URL}/files/covers/funk-groove.jpg`,
    isPublished: true
  },
  {
    title: "Classic Rock Crunch",
    description: "Vintage rock tone with classic crunch. Inspired by 70s rock legends.",
    processorType: "Neural DSP",
    tags: ["classic-rock", "vintage", "crunch", "70s"],
    price: 9.99,
    previewAudioUrl: `${STUB_BASE_URL}/files/previews/classic-rock.mp3`,
    presetFileUrl: `${STUB_BASE_URL}/files/presets/classic-rock.plugin`,
    coverImageUrl: `${STUB_BASE_URL}/files/covers/classic-rock.jpg`,
    isPublished: true
  },
  {
    title: "Progressive Metal Lead",
    description: "Complex lead tone with clarity and definition. Perfect for progressive metal solos.",
    processorType: "Axe-Fx",
    tags: ["progressive", "lead", "metal", "complex"],
    price: 15.99,
    previewAudioUrl: `${STUB_BASE_URL}/files/previews/prog-lead.mp3`,
    presetFileUrl: `${STUB_BASE_URL}/files/presets/prog-lead.syx`,
    coverImageUrl: `${STUB_BASE_URL}/files/covers/prog-lead.jpg`,
    isPublished: true
  }
];

// Helper function to generate mock orders after users and presets are created
export function generateMockOrders(
  userIds: Types.ObjectId[],
  presetIds: Types.ObjectId[]
): MockOrder[] {
  return [
    {
      userId: userIds[1].toString(), // user1@example.com
      presets: [presetIds[0].toString(), presetIds[2].toString()], // Heavy Rhythm + Lead Solo
      totalPrice: 22.98,
      stripeSessionId: "cs_test_1a2b3c4d5e6f7g8h9i0j",
      status: "paid"
    },
    {
      userId: userIds[1].toString(), // user1@example.com
      presets: [presetIds[4].toString()], // Vintage Blues
      totalPrice: 6.99,
      stripeSessionId: "cs_test_2b3c4d5e6f7g8h9i0j1k",
      status: "paid"
    },
    {
      userId: userIds[2].toString(), // user2@example.com
      presets: [presetIds[1].toString(), presetIds[3].toString(), presetIds[6].toString()], // Clean Chorus + Ambient + Jazz
      totalPrice: 22.97,
      stripeSessionId: "cs_test_3c4d5e6f7g8h9i0j1k2l",
      status: "paid"
    },
    {
      userId: userIds[2].toString(), // user2@example.com
      presets: [presetIds[5].toString()], // Djent Machine
      totalPrice: 14.99,
      stripeSessionId: "cs_test_4d5e6f7g8h9i0j1k2l3m",
      status: "pending"
    },
    {
      userId: userIds[3].toString(), // user3@example.com
      presets: [presetIds[7].toString()], // 80s Hair Metal
      totalPrice: 9.99,
      stripeSessionId: "cs_test_5e6f7g8h9i0j1k2l3m4n",
      status: "failed"
    }
  ];
}

// Helper function to generate mock download tokens for purchased presets
export function generateMockDownloadTokens(
  userIds: Types.ObjectId[],
  presetIds: Types.ObjectId[]
): MockDownloadToken[] {
  const tokens: MockDownloadToken[] = [];
  const now = new Date();

  // User 1 purchased presets 0, 2, 4
  tokens.push({
    presetId: presetIds[0].toString(),
    userId: userIds[1].toString(),
    expiresAt: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000) // 7 days from now
  });
  tokens.push({
    presetId: presetIds[2].toString(),
    userId: userIds[1].toString(),
    expiresAt: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)
  });
  tokens.push({
    presetId: presetIds[4].toString(),
    userId: userIds[1].toString(),
    expiresAt: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)
  });

  // User 2 purchased presets 1, 3, 6
  tokens.push({
    presetId: presetIds[1].toString(),
    userId: userIds[2].toString(),
    expiresAt: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)
  });
  tokens.push({
    presetId: presetIds[3].toString(),
    userId: userIds[2].toString(),
    expiresAt: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)
  });
  tokens.push({
    presetId: presetIds[6].toString(),
    userId: userIds[2].toString(),
    expiresAt: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)
  });

  return tokens;
}
