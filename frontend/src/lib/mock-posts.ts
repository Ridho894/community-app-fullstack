export interface Post {
    id: string;
    user: {
        id: string;
        username: string;
        avatar: string;
    };
    image: string;
    caption: string;
    tags: string[];
    postedAt: string;
    likes: number;
    comments: number;
}

export const mockPosts: Post[] = [
    {
        id: "1",
        user: {
            id: "user1",
            username: "jane_smith",
            avatar: "/avatars/jane.jpg"
        },
        image: "https://images.unsplash.com/photo-1513569771920-c9e1d31714af?w=600&h=600&q=80",
        caption: "Beautiful sunset at the beach today",
        tags: ["sunset", "beach", "nature", "summer"],
        postedAt: "2h ago",
        likes: 243,
        comments: 18
    },
    {
        id: "2",
        user: {
            id: "user2",
            username: "travel_enthusiast",
            avatar: "/avatars/traveler.jpg"
        },
        image: "https://images.unsplash.com/photo-1528164344705-47542687000d?w=600&h=600&q=80",
        caption: "Exploring ancient ruins in Greece. The history here is incredible!",
        tags: ["travel", "greece", "history", "architecture"],
        postedAt: "5h ago",
        likes: 512,
        comments: 32
    },
    {
        id: "3",
        user: {
            id: "user3",
            username: "food_lover",
            avatar: "/avatars/chef.jpg"
        },
        image: "https://images.unsplash.com/photo-1484723091739-30a097e8f929?w=600&h=600&q=80",
        caption: "Homemade pasta with fresh ingredients from the farmer's market",
        tags: ["food", "homemade", "cooking", "pasta"],
        postedAt: "1d ago",
        likes: 1024,
        comments: 76
    },
    {
        id: "4",
        user: {
            id: "user4",
            username: "fitness_guru",
            avatar: "/avatars/fitness.jpg"
        },
        image: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=600&h=600&q=80",
        caption: "Morning workout with an amazing view. Start your day right!",
        tags: ["fitness", "workout", "health", "motivation"],
        postedAt: "2d ago",
        likes: 876,
        comments: 42
    },
    {
        id: "5",
        user: {
            id: "user5",
            username: "tech_geek",
            avatar: "/avatars/tech.jpg"
        },
        image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600&h=600&q=80",
        caption: "Just got my hands on the latest gadget. The future is now!",
        tags: ["technology", "gadgets", "innovation", "future"],
        postedAt: "3d ago",
        likes: 654,
        comments: 28
    }
];