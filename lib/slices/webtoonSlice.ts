import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'

/**
 * Interface representing a webtoon/manga series
 * Contains all metadata and information about a series
 */
export interface Webtoon {
  /** Unique identifier for the webtoon */
  id: string
  /** Display title of the webtoon */
  title: string
  /** Original language of the webtoon */
  language: 'Korean' | 'Japanese'
  /** Array of genre tags */
  genre: string[]
  /** Average user rating (0-5 scale) */
  averageRating: number
  /** Total number of user ratings */
  ratingCount: number
  /** URL to the cover image */
  coverImage: string
  /** Current publication status */
  status: 'Ongoing' | 'Completed' | 'Hiatus'
  /** Brief description/synopsis */
  description: string
  /** Author/creator name (optional) */
  author?: string
  /** Year of first publication (optional) */
  publishedYear?: number
}

/**
 * Interface representing a single episode/chapter of a webtoon
 * Contains the actual content (images) and metadata
 */
export interface Episode {
  /** Unique identifier for the episode */
  id: string
  /** Display title of the episode */
  title: string
  /** Array of image URLs that make up the episode content */
  imageUrls: string[]
  /** Publication date (optional) */
  publishedAt?: string
  /** Chapter number for ordering (optional) */
  chapterNumber?: number
}

/**
 * Interface representing a user comment/review on a webtoon
 * Used for community features and ratings
 */
export interface Comment {
  /** Unique identifier for the comment */
  id: string
  /** ID of the user who made the comment */
  userId: string
  /** Display name of the user */
  userName: string
  /** Comment text content */
  content: string
  /** User's rating for this webtoon (0-5 scale) */
  rating: number
  /** Timestamp when comment was created */
  createdAt: string
}

/**
 * Redux state interface for the webtoon slice
 * Manages all webtoon-related data and UI state
 */
interface WebtoonState {
  /** Array of all loaded webtoons */
  webtoons: Webtoon[]
  /** Currently selected webtoon for detail view */
  currentWebtoon: Webtoon | null
  /** Episodes organized by webtoon ID */
  episodes: { [webtoonId: string]: Episode[] }
  /** Comments organized by webtoon ID */
  comments: { [webtoonId: string]: Comment[] }
  /** Currently reading episode */
  currentEpisode: Episode | null
  /** Loading state for async operations */
  loading: boolean
  /** Error message if any operation fails */
  error: string | null
  /** User-applied filters for browsing */
  filters: {
    /** Language filter */
    language: 'all' | 'Korean' | 'Japanese'
    /** Genre filter */
    genre: string
    /** Status filter */
    status: 'all' | 'Ongoing' | 'Completed' | 'Hiatus'
    /** Sorting preference */
    sortBy: 'rating' | 'popularity' | 'recent'
  }
}

/**
 * Mock data for webtoons - simulates a real database
 * Enhanced with realistic titles, descriptions, and metadata
 * Uses Pexels images for consistent, high-quality covers
 */
const mockWebtoons: Webtoon[] = [
  {
    id: "k1",
    title: "Solo Leveling",
    language: "Korean",
    genre: ["Action", "Fantasy"],
    averageRating: 4.9,
    ratingCount: 125000,
    coverImage: "https://images.pexels.com/photos/1591447/pexels-photo-1591447.jpeg?auto=compress&cs=tinysrgb&w=400",
    status: "Ongoing",
    description: "The weakest hunter in a world of magic awakens powerful abilities after a mysterious system appears, transforming him into humanity's strongest warrior.",
    author: "Chugong",
    publishedYear: 2018
  },
  {
    id: "k2",
    title: "Tower of God",
    language: "Korean",
    genre: ["Adventure", "Mystery"],
    averageRating: 4.8,
    ratingCount: 88000,
    coverImage: "https://images.pexels.com/photos/1591062/pexels-photo-1591062.jpeg?auto=compress&cs=tinysrgb&w=400",
    status: "Ongoing",
    description: "A boy enters a mysterious tower to find his lost friend Rachel, facing deadly challenges and powerful opponents on each floor.",
    author: "SIU",
    publishedYear: 2010
  },
  {
    id: "k3",
    title: "Noblesse",
    language: "Korean",
    genre: ["Supernatural", "School"],
    averageRating: 4.6,
    ratingCount: 67000,
    coverImage: "https://images.pexels.com/photos/1591056/pexels-photo-1591056.jpeg?auto=compress&cs=tinysrgb&w=400",
    status: "Completed",
    description: "A noble vampire awakens after 820 years to a modern world filled with technology, attending high school while protecting his new friends.",
    author: "Jeho Son",
    publishedYear: 2007
  },
  {
    id: "k4",
    title: "The God of High School",
    language: "Korean",
    genre: ["Action", "Martial Arts"],
    averageRating: 4.5,
    ratingCount: 75000,
    coverImage: "https://images.pexels.com/photos/1591051/pexels-photo-1591051.jpeg?auto=compress&cs=tinysrgb&w=400",
    status: "Completed",
    description: "High school students compete in a martial arts tournament with supernatural powers, uncovering ancient gods and mythical abilities.",
    author: "Yongje Park",
    publishedYear: 2011
  },
  {
    id: "k5",
    title: "Unordinary",
    language: "Korean",
    genre: ["School", "Supernatural"],
    averageRating: 4.4,
    ratingCount: 92000,
    coverImage: "https://images.pexels.com/photos/1591061/pexels-photo-1591061.jpeg?auto=compress&cs=tinysrgb&w=400",
    status: "Ongoing",
    description: "In a world where everyone has superpowers, John pretends to be powerless to survive in a society obsessed with hierarchy and strength.",
    author: "uru-chan",
    publishedYear: 2016
  },
  {
    id: "k6",
    title: "True Beauty",
    language: "Korean",
    genre: ["Romance", "School"],
    averageRating: 4.3,
    ratingCount: 110000,
    coverImage: "https://images.pexels.com/photos/1592384/pexels-photo-1592384.jpeg?auto=compress&cs=tinysrgb&w=400",
    status: "Completed",
    description: "Jugyeong transforms her appearance with makeup and navigates high school romance while hiding her true face from her classmates.",
    author: "Yaongyi",
    publishedYear: 2018
  },
  {
    id: "k7",
    title: "Lookism",
    language: "Korean",
    genre: ["Drama", "School"],
    averageRating: 4.7,
    ratingCount: 95000,
    coverImage: "https://images.pexels.com/photos/1040881/pexels-photo-1040881.jpeg?auto=compress&cs=tinysrgb&w=400",
    status: "Ongoing",
    description: "Park Hyung Suk, an unpopular and bullied high school student, wakes up in a different body and experiences life from a new perspective.",
    author: "Park Tae-joon",
    publishedYear: 2014
  },
  {
    id: "k8",
    title: "Sweet Home",
    language: "Korean",
    genre: ["Horror", "Thriller"],
    averageRating: 4.6,
    ratingCount: 78000,
    coverImage: "https://images.pexels.com/photos/2693212/pexels-photo-2693212.jpeg?auto=compress&cs=tinysrgb&w=400",
    status: "Completed",
    description: "Cha Hyun-soo moves into a new apartment and faces a world where humans transform into monsters based on their desires.",
    author: "Carnby Kim",
    publishedYear: 2017
  },
  {
    id: "j1",
    title: "Attack on Titan",
    language: "Japanese",
    genre: ["Action", "Drama"],
    averageRating: 4.8,
    ratingCount: 200000,
    coverImage: "https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=400",
    status: "Completed",
    description: "Humanity fights for survival against towering titans in a post-apocalyptic world, uncovering dark secrets about their origins.",
    author: "Hajime Isayama",
    publishedYear: 2009
  },
  {
    id: "j2",
    title: "Demon Slayer",
    language: "Japanese",
    genre: ["Action", "Supernatural"],
    averageRating: 4.7,
    ratingCount: 160000,
    coverImage: "https://images.pexels.com/photos/1040879/pexels-photo-1040879.jpeg?auto=compress&cs=tinysrgb&w=400",
    status: "Completed",
    description: "Tanjiro Kamado trains to defeat demons after his family is slaughtered, seeking to cure his sister who was turned into a demon.",
    author: "Koyoharu Gotouge",
    publishedYear: 2016
  },
  {
    id: "j3",
    title: "One Piece",
    language: "Japanese",
    genre: ["Adventure", "Comedy"],
    averageRating: 4.9,
    ratingCount: 500000,
    coverImage: "https://images.pexels.com/photos/1040878/pexels-photo-1040878.jpeg?auto=compress&cs=tinysrgb&w=400",
    status: "Ongoing",
    description: "Follow Monkey D. Luffy and his Straw Hat Pirates on their quest for the legendary One Piece treasure and the title of Pirate King.",
    author: "Eiichiro Oda",
    publishedYear: 1997
  },
  {
    id: "j4",
    title: "My Hero Academia",
    language: "Japanese",
    genre: ["Action", "School", "Superhero"],
    averageRating: 4.6,
    ratingCount: 180000,
    coverImage: "https://images.pexels.com/photos/1040877/pexels-photo-1040877.jpeg?auto=compress&cs=tinysrgb&w=400",
    status: "Ongoing",
    description: "In a world where 80% of people have superpowers called Quirks, Izuku Midoriya dreams of becoming a hero despite being born Quirkless.",
    author: "Kohei Horikoshi",
    publishedYear: 2014
  },
  {
    id: "j5",
    title: "Jujutsu Kaisen",
    language: "Japanese",
    genre: ["Action", "Supernatural", "School"],
    averageRating: 4.7,
    ratingCount: 140000,
    coverImage: "https://images.pexels.com/photos/1040876/pexels-photo-1040876.jpeg?auto=compress&cs=tinysrgb&w=400",
    status: "Ongoing",
    description: "Yuji Itadori joins Tokyo Jujutsu High School to battle cursed spirits after swallowing a powerful cursed object.",
    author: "Gege Akutami",
    publishedYear: 2018
  },
  {
    id: "j6",
    title: "Death Note",
    language: "Japanese",
    genre: ["Thriller", "Supernatural"],
    averageRating: 4.8,
    ratingCount: 220000,
    coverImage: "https://images.pexels.com/photos/1040875/pexels-photo-1040875.jpeg?auto=compress&cs=tinysrgb&w=400",
    status: "Completed",
    description: "Light Yagami finds a supernatural notebook that can kill anyone whose name is written in it, leading to a deadly game of cat and mouse with detective L.",
    author: "Tsugumi Ohba",
    publishedYear: 2003
  },
  {
    id: "j7",
    title: "Naruto",
    language: "Japanese",
    genre: ["Action", "Adventure"],
    averageRating: 4.5,
    ratingCount: 300000,
    coverImage: "https://images.pexels.com/photos/1040874/pexels-photo-1040874.jpeg?auto=compress&cs=tinysrgb&w=400",
    status: "Completed",
    description: "Naruto Uzumaki, a young ninja with a sealed demon fox inside him, dreams of becoming the strongest ninja and leader of his village.",
    author: "Masashi Kishimoto",
    publishedYear: 1999
  },
  {
    id: "j8",
    title: "One Punch Man",
    language: "Japanese",
    genre: ["Action", "Comedy", "Superhero"],
    averageRating: 4.6,
    ratingCount: 170000,
    coverImage: "https://images.pexels.com/photos/1040873/pexels-photo-1040873.jpeg?auto=compress&cs=tinysrgb&w=400",
    status: "Ongoing",
    description: "Saitama is a superhero who can defeat any enemy with a single punch, but struggles with the mundane problems of being too powerful.",
    author: "ONE",
    publishedYear: 2012
  }
]

/**
 * Mock episodes data - simulates webtoon content
 * Each episode contains multiple images that form a vertical scrolling story
 * Images are sized appropriately for webtoon reading (800x1200 aspect ratio)
 * Uses placeholder images from Pexels with consistent dimensions
 */
const mockEpisodes: { [key: string]: Episode[] } = {
  "k1": [
    {
      id: "ep1",
      title: "Solo Leveling Episode 1: The World's Weakest",
      imageUrls: [
        "https://images.pexels.com/photos/1591447/pexels-photo-1591447.jpeg?auto=compress&cs=tinysrgb&w=800&h=1200",
        "https://images.pexels.com/photos/1591062/pexels-photo-1591062.jpeg?auto=compress&cs=tinysrgb&w=800&h=1200",
        "https://images.pexels.com/photos/1591056/pexels-photo-1591056.jpeg?auto=compress&cs=tinysrgb&w=800&h=1200",
        "https://images.pexels.com/photos/1591051/pexels-photo-1591051.jpeg?auto=compress&cs=tinysrgb&w=800&h=1200",
        "https://images.pexels.com/photos/1591061/pexels-photo-1591061.jpeg?auto=compress&cs=tinysrgb&w=800&h=1200",
        "https://images.pexels.com/photos/1592384/pexels-photo-1592384.jpeg?auto=compress&cs=tinysrgb&w=800&h=1200",
        "https://images.pexels.com/photos/1040881/pexels-photo-1040881.jpeg?auto=compress&cs=tinysrgb&w=800&h=1200",
        "https://images.pexels.com/photos/2693212/pexels-photo-2693212.jpeg?auto=compress&cs=tinysrgb&w=800&h=1200",
        "https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=800&h=1200",
        "https://images.pexels.com/photos/1040879/pexels-photo-1040879.jpeg?auto=compress&cs=tinysrgb&w=800&h=1200",
        "https://images.pexels.com/photos/1040878/pexels-photo-1040878.jpeg?auto=compress&cs=tinysrgb&w=800&h=1200",
        "https://images.pexels.com/photos/1040877/pexels-photo-1040877.jpeg?auto=compress&cs=tinysrgb&w=800&h=1200",
        "https://images.pexels.com/photos/1040876/pexels-photo-1040876.jpeg?auto=compress&cs=tinysrgb&w=800&h=1200",
        "https://images.pexels.com/photos/1040875/pexels-photo-1040875.jpeg?auto=compress&cs=tinysrgb&w=800&h=1200",
        "https://images.pexels.com/photos/1040874/pexels-photo-1040874.jpeg?auto=compress&cs=tinysrgb&w=800&h=1200"
      ],
      chapterNumber: 1,
      publishedAt: "2024-01-01"
    },
    {
      id: "ep2",
      title: "Solo Leveling Episode 2: The System",
      imageUrls: [
        "https://images.pexels.com/photos/1040873/pexels-photo-1040873.jpeg?auto=compress&cs=tinysrgb&w=800&h=1200",
        "https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=800&h=1200",
        "https://images.pexels.com/photos/3861972/pexels-photo-3861972.jpeg?auto=compress&cs=tinysrgb&w=800&h=1200",
        "https://images.pexels.com/photos/3861976/pexels-photo-3861976.jpeg?auto=compress&cs=tinysrgb&w=800&h=1200",
        "https://images.pexels.com/photos/3861979/pexels-photo-3861979.jpeg?auto=compress&cs=tinysrgb&w=800&h=1200",
        "https://images.pexels.com/photos/3861982/pexels-photo-3861982.jpeg?auto=compress&cs=tinysrgb&w=800&h=1200",
        "https://images.pexels.com/photos/3861985/pexels-photo-3861985.jpeg?auto=compress&cs=tinysrgb&w=800&h=1200",
        "https://images.pexels.com/photos/3861988/pexels-photo-3861988.jpeg?auto=compress&cs=tinysrgb&w=800&h=1200",
        "https://images.pexels.com/photos/3861991/pexels-photo-3861991.jpeg?auto=compress&cs=tinysrgb&w=800&h=1200",
        "https://images.pexels.com/photos/3861994/pexels-photo-3861994.jpeg?auto=compress&cs=tinysrgb&w=800&h=1200",
        "https://images.pexels.com/photos/3861997/pexels-photo-3861997.jpeg?auto=compress&cs=tinysrgb&w=800&h=1200",
        "https://images.pexels.com/photos/3862000/pexels-photo-3862000.jpeg?auto=compress&cs=tinysrgb&w=800&h=1200"
      ],
      chapterNumber: 2,
      publishedAt: "2024-01-08"
    },
    {
      id: "ep3",
      title: "Solo Leveling Episode 3: The First Hunt",
      imageUrls: [
        "https://images.pexels.com/photos/3862003/pexels-photo-3862003.jpeg?auto=compress&cs=tinysrgb&w=800&h=1200",
        "https://images.pexels.com/photos/3862006/pexels-photo-3862006.jpeg?auto=compress&cs=tinysrgb&w=800&h=1200",
        "https://images.pexels.com/photos/3862009/pexels-photo-3862009.jpeg?auto=compress&cs=tinysrgb&w=800&h=1200",
        "https://images.pexels.com/photos/3862012/pexels-photo-3862012.jpeg?auto=compress&cs=tinysrgb&w=800&h=1200",
        "https://images.pexels.com/photos/3862015/pexels-photo-3862015.jpeg?auto=compress&cs=tinysrgb&w=800&h=1200",
        "https://images.pexels.com/photos/3862018/pexels-photo-3862018.jpeg?auto=compress&cs=tinysrgb&w=800&h=1200",
        "https://images.pexels.com/photos/3862021/pexels-photo-3862021.jpeg?auto=compress&cs=tinysrgb&w=800&h=1200",
        "https://images.pexels.com/photos/3862024/pexels-photo-3862024.jpeg?auto=compress&cs=tinysrgb&w=800&h=1200",
        "https://images.pexels.com/photos/3862027/pexels-photo-3862027.jpeg?auto=compress&cs=tinysrgb&w=800&h=1200",
        "https://images.pexels.com/photos/3862030/pexels-photo-3862030.jpeg?auto=compress&cs=tinysrgb&w=800&h=1200"
      ],
      chapterNumber: 3,
      publishedAt: "2024-01-15"
    }
  ],
  "k2": [
    {
      id: "ep1",
      title: "Tower of God Episode 1: Ball",
      imageUrls: [
        "https://images.pexels.com/photos/3862033/pexels-photo-3862033.jpeg?auto=compress&cs=tinysrgb&w=800&h=1200",
        "https://images.pexels.com/photos/3862036/pexels-photo-3862036.jpeg?auto=compress&cs=tinysrgb&w=800&h=1200",
        "https://images.pexels.com/photos/3862039/pexels-photo-3862039.jpeg?auto=compress&cs=tinysrgb&w=800&h=1200",
        "https://images.pexels.com/photos/3862042/pexels-photo-3862042.jpeg?auto=compress&cs=tinysrgb&w=800&h=1200",
        "https://images.pexels.com/photos/3862045/pexels-photo-3862045.jpeg?auto=compress&cs=tinysrgb&w=800&h=1200",
        "https://images.pexels.com/photos/3862048/pexels-photo-3862048.jpeg?auto=compress&cs=tinysrgb&w=800&h=1200",
        "https://images.pexels.com/photos/3862051/pexels-photo-3862051.jpeg?auto=compress&cs=tinysrgb&w=800&h=1200",
        "https://images.pexels.com/photos/3862054/pexels-photo-3862054.jpeg?auto=compress&cs=tinysrgb&w=800&h=1200",
        "https://images.pexels.com/photos/3862057/pexels-photo-3862057.jpeg?auto=compress&cs=tinysrgb&w=800&h=1200",
        "https://images.pexels.com/photos/3862060/pexels-photo-3862060.jpeg?auto=compress&cs=tinysrgb&w=800&h=1200",
        "https://images.pexels.com/photos/3862063/pexels-photo-3862063.jpeg?auto=compress&cs=tinysrgb&w=800&h=1200",
        "https://images.pexels.com/photos/3862066/pexels-photo-3862066.jpeg?auto=compress&cs=tinysrgb&w=800&h=1200"
      ],
      chapterNumber: 1,
      publishedAt: "2024-01-01"
    },
    {
      id: "ep2",
      title: "Tower of God Episode 2: 3/400",
      imageUrls: [
        "https://images.pexels.com/photos/3862069/pexels-photo-3862069.jpeg?auto=compress&cs=tinysrgb&w=800&h=1200",
        "https://images.pexels.com/photos/3862072/pexels-photo-3862072.jpeg?auto=compress&cs=tinysrgb&w=800&h=1200",
        "https://images.pexels.com/photos/3862075/pexels-photo-3862075.jpeg?auto=compress&cs=tinysrgb&w=800&h=1200",
        "https://images.pexels.com/photos/3862078/pexels-photo-3862078.jpeg?auto=compress&cs=tinysrgb&w=800&h=1200",
        "https://images.pexels.com/photos/3862081/pexels-photo-3862081.jpeg?auto=compress&cs=tinysrgb&w=800&h=1200",
        "https://images.pexels.com/photos/3862084/pexels-photo-3862084.jpeg?auto=compress&cs=tinysrgb&w=800&h=1200",
        "https://images.pexels.com/photos/3862087/pexels-photo-3862087.jpeg?auto=compress&cs=tinysrgb&w=800&h=1200",
        "https://images.pexels.com/photos/3862090/pexels-photo-3862090.jpeg?auto=compress&cs=tinysrgb&w=800&h=1200"
      ],
      chapterNumber: 2,
      publishedAt: "2024-01-08"
    }
  ],
  "j1": [
    {
      id: "ep1",
      title: "AOT: To You, 2000 Years Ago",
      imageUrls: [
        "https://images.pexels.com/photos/3862093/pexels-photo-3862093.jpeg?auto=compress&cs=tinysrgb&w=800&h=1200",
        "https://images.pexels.com/photos/3862096/pexels-photo-3862096.jpeg?auto=compress&cs=tinysrgb&w=800&h=1200",
        "https://images.pexels.com/photos/3862099/pexels-photo-3862099.jpeg?auto=compress&cs=tinysrgb&w=800&h=1200",
        "https://images.pexels.com/photos/3862102/pexels-photo-3862102.jpeg?auto=compress&cs=tinysrgb&w=800&h=1200",
        "https://images.pexels.com/photos/3862105/pexels-photo-3862105.jpeg?auto=compress&cs=tinysrgb&w=800&h=1200",
        "https://images.pexels.com/photos/3862108/pexels-photo-3862108.jpeg?auto=compress&cs=tinysrgb&w=800&h=1200",
        "https://images.pexels.com/photos/3862111/pexels-photo-3862111.jpeg?auto=compress&cs=tinysrgb&w=800&h=1200",
        "https://images.pexels.com/photos/3862114/pexels-photo-3862114.jpeg?auto=compress&cs=tinysrgb&w=800&h=1200",
        "https://images.pexels.com/photos/3862117/pexels-photo-3862117.jpeg?auto=compress&cs=tinysrgb&w=800&h=1200",
        "https://images.pexels.com/photos/3862120/pexels-photo-3862120.jpeg?auto=compress&cs=tinysrgb&w=800&h=1200",
        "https://images.pexels.com/photos/3862123/pexels-photo-3862123.jpeg?auto=compress&cs=tinysrgb&w=800&h=1200",
        "https://images.pexels.com/photos/3862126/pexels-photo-3862126.jpeg?auto=compress&cs=tinysrgb&w=800&h=1200"
      ],
      chapterNumber: 1,
      publishedAt: "2024-01-01"
    },
    {
      id: "ep2",
      title: "AOT: That Day",
      imageUrls: [
        "https://images.pexels.com/photos/3862129/pexels-photo-3862129.jpeg?auto=compress&cs=tinysrgb&w=800&h=1200",
        "https://images.pexels.com/photos/3862132/pexels-photo-3862132.jpeg?auto=compress&cs=tinysrgb&w=800&h=1200",
        "https://images.pexels.com/photos/3862135/pexels-photo-3862135.jpeg?auto=compress&cs=tinysrgb&w=800&h=1200",
        "https://images.pexels.com/photos/3862138/pexels-photo-3862138.jpeg?auto=compress&cs=tinysrgb&w=800&h=1200",
        "https://images.pexels.com/photos/3862141/pexels-photo-3862141.jpeg?auto=compress&cs=tinysrgb&w=800&h=1200",
        "https://images.pexels.com/photos/3862144/pexels-photo-3862144.jpeg?auto=compress&cs=tinysrgb&w=800&h=1200",
        "https://images.pexels.com/photos/3862147/pexels-photo-3862147.jpeg?auto=compress&cs=tinysrgb&w=800&h=1200",
        "https://images.pexels.com/photos/3862150/pexels-photo-3862150.jpeg?auto=compress&cs=tinysrgb&w=800&h=1200"
      ],
      chapterNumber: 2,
      publishedAt: "2024-01-08"
    }
  ],
  "j3": [
    {
      id: "ep1",
      title: "One Piece Episode 1: I'm Luffy! The Man Who's Gonna Be King of the Pirates!",
      imageUrls: [
        "https://images.pexels.com/photos/3862153/pexels-photo-3862153.jpeg?auto=compress&cs=tinysrgb&w=800&h=1200",
        "https://images.pexels.com/photos/3862156/pexels-photo-3862156.jpeg?auto=compress&cs=tinysrgb&w=800&h=1200",
        "https://images.pexels.com/photos/3862159/pexels-photo-3862159.jpeg?auto=compress&cs=tinysrgb&w=800&h=1200",
        "https://images.pexels.com/photos/3862162/pexels-photo-3862162.jpeg?auto=compress&cs=tinysrgb&w=800&h=1200",
        "https://images.pexels.com/photos/3862165/pexels-photo-3862165.jpeg?auto=compress&cs=tinysrgb&w=800&h=1200",
        "https://images.pexels.com/photos/3862168/pexels-photo-3862168.jpeg?auto=compress&cs=tinysrgb&w=800&h=1200",
        "https://images.pexels.com/photos/3862171/pexels-photo-3862171.jpeg?auto=compress&cs=tinysrgb&w=800&h=1200",
        "https://images.pexels.com/photos/3862174/pexels-photo-3862174.jpeg?auto=compress&cs=tinysrgb&w=800&h=1200",
        "https://images.pexels.com/photos/3862177/pexels-photo-3862177.jpeg?auto=compress&cs=tinysrgb&w=800&h=1200",
        "https://images.pexels.com/photos/3862180/pexels-photo-3862180.jpeg?auto=compress&cs=tinysrgb&w=800&h=1200"
      ],
      chapterNumber: 1,
      publishedAt: "2024-01-01"
    },
    {
      id: "ep2",
      title: "One Piece Episode 2: Enter the Great Pirate Era!",
      imageUrls: [
        "https://images.pexels.com/photos/3862183/pexels-photo-3862183.jpeg?auto=compress&cs=tinysrgb&w=800&h=1200",
        "https://images.pexels.com/photos/3862186/pexels-photo-3862186.jpeg?auto=compress&cs=tinysrgb&w=800&h=1200",
        "https://images.pexels.com/photos/3862189/pexels-photo-3862189.jpeg?auto=compress&cs=tinysrgb&w=800&h=1200",
        "https://images.pexels.com/photos/3862192/pexels-photo-3862192.jpeg?auto=compress&cs=tinysrgb&w=800&h=1200",
        "https://images.pexels.com/photos/3862195/pexels-photo-3862195.jpeg?auto=compress&cs=tinysrgb&w=800&h=1200",
        "https://images.pexels.com/photos/3862198/pexels-photo-3862198.jpeg?auto=compress&cs=tinysrgb&w=800&h=1200",
        "https://images.pexels.com/photos/3862201/pexels-photo-3862201.jpeg?auto=compress&cs=tinysrgb&w=800&h=1200",
        "https://images.pexels.com/photos/3862204/pexels-photo-3862204.jpeg?auto=compress&cs=tinysrgb&w=800&h=1200"
      ],
      chapterNumber: 2,
      publishedAt: "2024-01-08"
    }
  ],
  "j6": [
    {
      id: "ep1",
      title: "Death Note Episode 1: Boredom",
      imageUrls: [
        "https://images.pexels.com/photos/3862207/pexels-photo-3862207.jpeg?auto=compress&cs=tinysrgb&w=800&h=1200",
        "https://images.pexels.com/photos/3862210/pexels-photo-3862210.jpeg?auto=compress&cs=tinysrgb&w=800&h=1200",
        "https://images.pexels.com/photos/3862213/pexels-photo-3862213.jpeg?auto=compress&cs=tinysrgb&w=800&h=1200",
        "https://images.pexels.com/photos/3862216/pexels-photo-3862216.jpeg?auto=compress&cs=tinysrgb&w=800&h=1200",
        "https://images.pexels.com/photos/3862219/pexels-photo-3862219.jpeg?auto=compress&cs=tinysrgb&w=800&h=1200",
        "https://images.pexels.com/photos/3862222/pexels-photo-3862222.jpeg?auto=compress&cs=tinysrgb&w=800&h=1200",
        "https://images.pexels.com/photos/3862225/pexels-photo-3862225.jpeg?auto=compress&cs=tinysrgb&w=800&h=1200",
        "https://images.pexels.com/photos/3862228/pexels-photo-3862228.jpeg?auto=compress&cs=tinysrgb&w=800&h=1200",
        "https://images.pexels.com/photos/3862231/pexels-photo-3862231.jpeg?auto=compress&cs=tinysrgb&w=800&h=1200",
        "https://images.pexels.com/photos/3862234/pexels-photo-3862234.jpeg?auto=compress&cs=tinysrgb&w=800&h=1200"
      ],
      chapterNumber: 1,
      publishedAt: "2024-01-01"
    }
  ]
}

/**
 * Initial state for the webtoon slice
 * Sets up default values for all state properties
 */
const initialState: WebtoonState = {
  webtoons: [],
  currentWebtoon: null,
  episodes: {},
  comments: {},
  currentEpisode: null,
  loading: false,
  error: null,
  filters: {
    language: 'all',
    genre: 'all',
    status: 'all',
    sortBy: 'rating'
  }
}

/**
 * Async thunk to fetch all webtoons
 * Simulates an API call with loading delay
 * @returns Promise<Webtoon[]> Array of all available webtoons
 */
export const fetchWebtoons = createAsyncThunk(
  'webtoons/fetchWebtoons',
  async () => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    return mockWebtoons
  }
)

/**
 * Async thunk to fetch a specific webtoon by ID
 * Used for webtoon detail pages
 * @param id - The unique identifier of the webtoon
 * @returns Promise<Webtoon> The requested webtoon data
 * @throws Error if webtoon is not found
 */
export const fetchWebtoonById = createAsyncThunk(
  'webtoons/fetchWebtoonById',
  async (id: string) => {
    await new Promise(resolve => setTimeout(resolve, 500))
    const webtoon = mockWebtoons.find(w => w.id === id)
    if (!webtoon) throw new Error('Webtoon not found')
    return webtoon
  }
)

/**
 * Async thunk to fetch episodes for a specific webtoon
 * Used when user wants to read a webtoon
 * @param webtoonId - The ID of the webtoon to fetch episodes for
 * @returns Promise<{webtoonId: string, episodes: Episode[]}> Episodes data with webtoon ID
 */
export const fetchEpisodes = createAsyncThunk(
  'webtoons/fetchEpisodes',
  async (webtoonId: string) => {
    await new Promise(resolve => setTimeout(resolve, 500))
    return { webtoonId, episodes: mockEpisodes[webtoonId] || [] }
  }
)

/**
 * Redux slice for webtoon state management
 * Handles all webtoon-related actions and state updates
 */
const webtoonSlice = createSlice({
  name: 'webtoons',
  initialState,
  reducers: {
    /**
     * Updates the current filter settings
     * Allows partial updates to maintain existing filter values
     * @param state - Current state
     * @param action - Partial filter object to merge
     */
    setFilters: (state, action: PayloadAction<Partial<WebtoonState['filters']>>) => {
      state.filters = { ...state.filters, ...action.payload }
    },
    
    /**
     * Sets the currently reading episode
     * Used in the episode reader component
     * @param state - Current state
     * @param action - Episode object to set as current
     */
    setCurrentEpisode: (state, action: PayloadAction<Episode>) => {
      state.currentEpisode = action.payload
    },
    
    /**
     * Clears the current webtoon and episode
     * Used when navigating away from webtoon pages
     * @param state - Current state
     */
    clearCurrentWebtoon: (state) => {
      state.currentWebtoon = null
      state.currentEpisode = null
    },
    
    /**
     * Resets all filters to their default values
     * Used by the "Clear Filters" functionality
     * @param state - Current state
     */
    clearFilters: (state) => {
      state.filters = {
        language: 'all',
        genre: 'all',
        status: 'all',
        sortBy: 'rating'
      }
    }
  },
  extraReducers: (builder) => {
    builder
      // Handle fetchWebtoons async actions
      .addCase(fetchWebtoons.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchWebtoons.fulfilled, (state, action) => {
        state.loading = false
        state.webtoons = action.payload
      })
      .addCase(fetchWebtoons.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Failed to fetch webtoons'
      })
      
      // Handle fetchWebtoonById async actions
      .addCase(fetchWebtoonById.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchWebtoonById.fulfilled, (state, action) => {
        state.loading = false
        state.currentWebtoon = action.payload
      })
      .addCase(fetchWebtoonById.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Failed to fetch webtoon'
      })
      
      // Handle fetchEpisodes async actions
      .addCase(fetchEpisodes.fulfilled, (state, action) => {
        state.episodes[action.payload.webtoonId] = action.payload.episodes
      })
  }
})

// Export actions for use in components
export const { setFilters, setCurrentEpisode, clearCurrentWebtoon, clearFilters } = webtoonSlice.actions

// Export reducer for store configuration
export default webtoonSlice.reducer