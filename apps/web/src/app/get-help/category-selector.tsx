'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Language, PlatformSlug, ProblemCategory } from '../public-help-content';

interface CategorySelectorProps {
  categories: ProblemCategory[];
  language: Language;
  platform: PlatformSlug;
}

export function CategorySelector({ categories, language, platform }: CategorySelectorProps) {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<string>();

  function chooseCategory(category: ProblemCategory) {
    setSelectedCategory(category.slug);
    const params = new URLSearchParams({
      platform,
      category: category.slug,
      lang: language,
    });

    router.push(`/submit-request?${params.toString()}`);
  }

  return (
    <div className="category-list">
      {categories.map((category) => (
        <button
          aria-pressed={selectedCategory === category.slug}
          className="category-card"
          key={category.slug}
          onClick={() => chooseCategory(category)}
          type="button"
        >
          <span className="category-icon" aria-hidden="true">
            {category.icon}
          </span>
          <span>
            <span className="category-title">{category.title[language]}</span>
            <span className="category-description">{category.description[language]}</span>
          </span>
        </button>
      ))}
    </div>
  );
}
