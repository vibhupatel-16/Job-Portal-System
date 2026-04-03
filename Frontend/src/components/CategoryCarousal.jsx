import React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "./ui/carousel";
import { Button } from "./ui/button";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setSearchedQuery, setFilter } from "@/redux/jobSlice";
import { motion } from "framer-motion";
import {
  Code2,
  Smartphone,
  Globe,
  Layout,
  Boxes,
  Briefcase,
  Cpu,
  Palette,
} from "lucide-react";

const categories = [
  { label: "Full Stack Developer", icon: Code2 },
  { label: "React Developer", icon: Layout },
  { label: "Java Developer", icon: Cpu },
  { label: "Python Developer", icon: Code2 },
  { label: "Mobile Developer", icon: Smartphone },
  { label: "UI Developer", icon: Palette },
  { label: "Product Manager", icon: Briefcase },
  { label: "ASP.NET Developer", icon: Boxes },
];

const CategoryCarousal = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const searchJobHandler = (cat) => {
    dispatch(setSearchedQuery(cat.label));
    dispatch(setFilter({ category: "", jobType: "", salary: "", experience: "" }));
    navigate("/browse");
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12 lg:py-16">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-8"
      >
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
          Browse by <span className="text-indigo-600">Category</span>
        </h2>
        <p className="mt-1 text-gray-600">Find jobs that match your skills</p>
      </motion.div>
      <Carousel className="w-full max-w-5xl mx-auto">
        <CarouselContent className="-ml-2 md:-ml-4">
          {categories.map((cat, index) => {
            const Icon = cat.icon;
            return (
              <CarouselItem
                key={index}
                className="pl-2 md:pl-4 basis-full xs:basis-1/2 sm:basis-1/3 md:basis-1/4"
              >
                <Button
                  onClick={() => searchJobHandler(cat)}
                  variant="outline"
                  className="w-full h-auto py-4 px-4 rounded-xl border-gray-200 hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700 transition-all duration-200 flex flex-col sm:flex-row items-center gap-2 text-left"
                >
                  <Icon className="h-5 w-5 shrink-0 text-indigo-500" />
                  <span className="text-sm font-medium truncate">{cat.label}</span>
                </Button>
              </CarouselItem>
            );
          })}
        </CarouselContent>
        <CarouselPrevious className="hidden sm:flex -left-4" />
        <CarouselNext className="hidden sm:flex -right-4" />
      </Carousel>
    </section>
  );
};

export default CategoryCarousal;
