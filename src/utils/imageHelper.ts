import type { Category } from "../types";

/**
 * Get Unsplash image URL for menu items by category
 * Using Unsplash Source API for free, high-quality food/drink images
 */
export function getMenuImageUrl(category: Category, index: number = 0): string {
  const imageMap: Record<Category, string[]> = {
    coffee: [
      "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1497935586351-b67a49e012bf?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1509042239860-f550c710ba35?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1517487881594-2787fef5ebf7?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1501339847302-ac426a4c7c6e?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1517487881594-2787fef5ebf7?w=400&h=300&fit=crop",
    ],
    matcha: [
      "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1571934811356-5cc061b6821f?w=400&h=300&fit=crop",
    ],
    cacao: [
      "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=400&h=300&fit=crop",
    ],
    juice: [
      "https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?w=400&h=300&fit=crop",
    ],
    topping: [
      "https://images.unsplash.com/photo-1551024506-0bccd828d307?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1551024506-0bccd828d307?w=400&h=300&fit=crop",
    ],
    tea: [
      "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1571934811356-5cc061b6821f?w=400&h=300&fit=crop",
    ],
    milktea: [
      "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1571934811356-5cc061b6821f?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400&h=300&fit=crop",
    ],
    smoothie: [
      "https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=400&h=300&fit=crop",
    ],
    special: [
      "https://images.unsplash.com/photo-1517487881594-2787fef5ebf7?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1509042239860-f550c710ba35?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400&h=300&fit=crop",
    ],
  };

  const images = imageMap[category] || imageMap.coffee;
  return images[index % images.length];
}
