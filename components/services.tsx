import { Card, CardContent } from "@/components/ui/card"
import { Target, TrendingUp, Lightbulb, BarChart3, Megaphone, Users } from "lucide-react"
import { Tag } from "@/components/ui/tag"

const services = [
  {
    icon: Target,
    title: "Brand Strategy",
    description:
      "Build a powerful brand identity that resonates with your target audience and stands out in the market.",
  },
  {
    icon: TrendingUp,
    title: "Growth Marketing",
    description:
      "Scale your business with data-driven growth strategies that deliver measurable ROI and sustainable results.",
  },
  {
    icon: Lightbulb,
    title: "Creative Campaigns",
    description:
      "Engage your audience with innovative campaigns that tell your story and drive meaningful connections.",
  },
  {
    icon: BarChart3,
    title: "Analytics & Insights",
    description:
      "Make informed decisions with comprehensive analytics and actionable insights from your marketing data.",
  },
  {
    icon: Megaphone,
    title: "Digital Advertising",
    description: "Maximize your reach with targeted digital advertising campaigns across all major platforms.",
  },
  {
    icon: Users,
    title: "Marketing Consulting",
    description: "Get expert guidance to optimize your marketing strategy and unlock your full growth potential.",
  },
]

export function Services() {
  return (
    <section id="services" className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <Tag variant="sectionLabel" className="mb-4">
            Our Services
          </Tag>
          <h2 className="text-4xl md:text-5xl font-medium mb-4 text-balance">Comprehensive Marketing Solutions</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed text-pretty">
            From strategy to execution, we provide end-to-end marketing services tailored to your business goals.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <Card key={index} className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardContent className="p-8">
                <div className="w-14 h-14 bg-primary/10 rounded-lg flex items-center justify-center mb-6 group-hover:bg-primary group-hover:scale-110 transition-all duration-300">
                  <service.icon className="w-7 h-7 text-primary group-hover:text-primary-foreground transition-colors duration-300" />
                </div>
                <h3 className="text-xl font-medium mb-3">{service.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{service.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
