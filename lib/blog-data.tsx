export interface BlogPost {
  id: number
  slug: string
  title: string
  excerpt: string
  content?: string
  category: string
  date: string
  readTime: string
  author: string
  image: string
  featured?: boolean
}

const blogPosts: BlogPost[] = [
  {
    id: 1,
    slug: "advanced-ocr-llamaindex-n8n",
    title: "Advanced OCR with Llamaindex extraction and n8n",
    excerpt:
      "Learn how to build powerful document processing workflows combining OCR technology with AI-powered extraction.",
    content: `
      <h2>Introduction</h2>
      <p>Mi tincidunt elit, id quisque ligula ac diam, amet. Vel etiam suspendisse morbi eleifend faucibus eget vestibulum felis. Dictum quis montes, sit sit. Tellus aliquam enim urna, etiam. Mauris posuere vulputate arcu amet, vitae nisi, tellus tincidunt.</p>
      <p>Eget quis mi enim, leo lacinia pharetra, semper. Eget in volutpat mollis at volutpat lectus velit, sed auctor. Porttitor fames arcu quis fusce augue enim. Quis at habitant diam at. Suscipit tristique risus, at donec. In turpis vel et quam imperdiet. Ipsum molestie aliquet sodales id est ac volutpat.</p>
      
      <h2>Dolor enim eu tortor urna sed duis nulla</h2>
      <p>Aliquam vestibulum, nulla odio nisl vitae. In aliquet pellentesque aenean hac vestibulum turpis mi bibendum diam. Tempor integer aliquam in vitae malesuada fringilla.</p>
      <p>Elit nisi in eleifend sed nisi. Pulvinar at orci, proin imperdiet commodo consectetur convallis risus. Sed condimentum enim dignissim adipiscing faucibus consequat, urna. Viverra purus et erat auctor aliquam. Risus, volutpat vulputate posuere purus sit congue convallis aliquet. Arcu id augue ut feugiat donec porttitor neque. Mauris, neque ultricies eu vestibulum, bibendum quam lorem id. Dolor lacus, eget nunc lectus in tellus, pharetra, porttitor.</p>
      
      <blockquote>"Ipsum sit mattis nulla quam nulla. Gravida id gravida ac enim mauris id. Non pellentesque congue eget consectetur turpis. Sapien, dictum molestie sem tempor. Diam elit, orci, tincidunt aenean tempus."</blockquote>
      
      <p>Tristique odio senectus nam posuere ornare leo metus, ultricies. Blandit duis ultricies vulputate morbi feugiat cras placerat elit. Aliquam tellus lorem sed ac. Montes, sed mattis pellentesque suscipit accumsan. Cursus viverra aenean magna risus elementum faucibus molestie pellentesque. Arcu ultricies sed mauris vestibulum.</p>
      
      <h2>Conclusion</h2>
      <p>Morbi sed imperdiet in ipsum, adipiscing elit dui lectus. Tellus id scelerisque est ultricies ultricies. Duis est sed leo nisl, blandit elit sagittis. Quisque consequat quam sed. Nisl at scelerisque amet nulla purus habitasse.</p>
      <p>Nunc sed faucibus bibendum feugiat sed interdum. Ipsum egestas condimentum mi massa. In tincidunt pharetra consectetur sed duis facilisis metus. Etiam egestas in nec sed et. Quis lobortis at sit dictum eget nibh tortor commodo cursus.</p>
      <p>Odio felis sagittis, morbi feugiat tortor vitae feugiat fusce aliquet. Nam elementum urna nisi aliquet erat dolor enim. Ornare id morbi eget ipsum. Aliquam senectus neque ut id eget consectetur dictum. Donec posuere pharetra odio consequat scelerisque et, nunc tortor. Nulla adipiscing erat a erat. Condimentum lorem posuere gravida enim posuere cursus diam.
    `,
    category: "Automation",
    date: "15 Jan 2025",
    readTime: "6 min read",
    author: "Granite Marketing",
    image: "/document-scanning-data-extraction.jpg",
    featured: true,
  },
  {
    id: 2,
    slug: "n8n-workflow-beginner-guide",
    title: "n8n workflow automation: A beginner's guide",
    excerpt: "Get started with n8n and learn how to create your first automation workflows without writing code.",
    content: `
      <h2>Introduction</h2>
      <p>Workflow automation has become essential for modern businesses. In this comprehensive guide, we'll explore how n8n makes automation accessible to everyone.</p>
      
      <h2>Getting Started</h2>
      <p>n8n is a powerful workflow automation tool that connects your apps and services. Whether you're automating email responses, syncing data between platforms, or building complex integrations, n8n provides the flexibility you need.</p>
      
      <h2>Key Features</h2>
      <p>From visual workflow building to custom functions, n8n offers everything you need to automate your business processes efficiently.</p>
    `,
    category: "Tutorial",
    date: "12 Jan 2025",
    readTime: "8 min read",
    author: "Granite Marketing",
    image: "/workflow-diagram-nodes-connections.jpg",
  },
  {
    id: 3,
    slug: "ai-integration-best-practices",
    title: "AI integration best practices for modern businesses",
    excerpt: "Discover how to successfully integrate AI tools into your existing workflows and maximize efficiency.",
    content: `<h2>Introduction</h2><p>AI is transforming how businesses operate. Learn the best practices for seamless integration.</p>`,
    category: "AI & ML",
    date: "10 Jan 2025",
    readTime: "7 min read",
    author: "Granite Marketing",
    image: "/ai-integration-software-tools.jpg",
  },
  {
    id: 4,
    slug: "error-handling-automation-workflows",
    title: "Error handling in automation workflows",
    excerpt: "Learn essential strategies for building robust automation workflows that gracefully handle errors.",
    content: `<h2>Introduction</h2><p>Error handling is crucial for reliable automation. Discover proven strategies.</p>`,
    category: "Tutorial",
    date: "8 Jan 2025",
    readTime: "5 min read",
    author: "Granite Marketing",
    image: "/error-warning-analytics-dashboard.jpg",
  },
  {
    id: 5,
    slug: "data-extraction-techniques",
    title: "Modern data extraction techniques",
    excerpt: "Explore cutting-edge methods for extracting and processing data from various sources.",
    content: `<h2>Introduction</h2><p>Data extraction is the foundation of automation. Learn modern techniques.</p>`,
    category: "Data Processing",
    date: "5 Jan 2025",
    readTime: "6 min read",
    author: "Granite Marketing",
    image: "/automation-dashboard-interface.jpg",
  },
  {
    id: 6,
    slug: "building-scalable-workflows",
    title: "Building scalable automation workflows",
    excerpt: "Master the art of creating workflows that grow with your business needs.",
    content: `<h2>Introduction</h2><p>Scalability is key to long-term automation success. Learn how to build for growth.</p>`,
    category: "Automation",
    date: "3 Jan 2025",
    readTime: "9 min read",
    author: "Granite Marketing",
    image: "/workflow-diagram-nodes-connections.jpg",
  },
  {
    id: 7,
    slug: "api-integration-fundamentals",
    title: "API integration fundamentals",
    excerpt: "Understanding APIs is crucial for modern automation. Learn the fundamentals.",
    content: `<h2>Introduction</h2><p>APIs power modern integrations. Master the fundamentals.</p>`,
    category: "Integration",
    date: "1 Jan 2025",
    readTime: "7 min read",
    author: "Granite Marketing",
    image: "/ai-integration-software-tools.jpg",
  },
  {
    id: 8,
    slug: "monitoring-automation-performance",
    title: "Monitoring automation performance",
    excerpt: "Keep your automations running smoothly with effective monitoring strategies.",
    content: `<h2>Introduction</h2><p>Monitoring ensures your automations stay healthy. Learn best practices.</p>`,
    category: "Operations",
    date: "28 Dec 2024",
    readTime: "6 min read",
    author: "Granite Marketing",
    image: "/error-warning-analytics-dashboard.jpg",
  },
  {
    id: 9,
    slug: "workflow-optimization-tips",
    title: "10 workflow optimization tips",
    excerpt: "Optimize your automation workflows for maximum efficiency and reliability.",
    content: `<h2>Introduction</h2><p>Optimization makes good workflows great. Discover our top 10 tips.</p>`,
    category: "Best Practices",
    date: "25 Dec 2024",
    readTime: "5 min read",
    author: "Granite Marketing",
    image: "/automation-dashboard-interface.jpg",
  },
]

export function getAllPosts(): BlogPost[] {
  return blogPosts
}

export function getPostBySlug(slug: string): BlogPost | undefined {
  return blogPosts.find((post) => post.slug === slug)
}

export function getRelatedPosts(currentPostId: number, limit = 3): BlogPost[] {
  return blogPosts.filter((post) => post.id !== currentPostId).slice(0, limit)
}

export function getPostsByCategory(category: string): BlogPost[] {
  if (category === "All") return blogPosts
  return blogPosts.filter((post) => post.category === category)
}

export function getFeaturedPost(): BlogPost | undefined {
  return blogPosts.find((post) => post.featured)
}

export function getCategories(): string[] {
  const categories = new Set(blogPosts.map((post) => post.category))
  return ["All", ...Array.from(categories)]
}
