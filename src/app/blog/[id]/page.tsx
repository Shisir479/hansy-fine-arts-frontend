"use client";

import { useGetBlogByIdQuery, useGetBlogsQuery } from "@/lib/redux/api/blogApi";
import { ArrowLeft, Share2, Facebook, Twitter, Linkedin } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { motion, useScroll, useSpring } from "framer-motion";

export default function BlogDetailPage() {
    const { id } = useParams();
    const blogId = Array.isArray(id) ? id[0] : id;

    const { data: blogResponse, isLoading, error } = useGetBlogByIdQuery(blogId as string, {
        skip: !blogId,
    });

    // Fetch suggested blogs for the bottom section
    const { data: suggestedBlogs } = useGetBlogsQuery({ limit: 4, status: 'published' });

    const { scrollYProgress } = useScroll();
    const scaleX = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });

    const [isMounted, setIsMounted] = useState(false);
    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white dark:bg-black">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-t-2 border-r-2 border-black dark:border-white rounded-full animate-spin" />
                    <p className="text-zinc-500 font-light tracking-[0.2em] text-xs">CURATING STORY...</p>
                </div>
            </div>
        );
    }

    if (error || !blogResponse?.data) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white dark:bg-black">
                <div className="text-center space-y-6">
                    <h1 className="text-3xl md:text-5xl font-serif italic text-zinc-900 dark:text-white">Story not found</h1>
                    <Link href="/" className="inline-block px-8 py-3 bg-black text-white dark:bg-white dark:text-black text-xs uppercase tracking-widest hover:opacity-80 transition-opacity">
                        Return to Gallery
                    </Link>
                </div>
            </div>
        );
    }

    const blog = blogResponse.data;

    // Helper functions for safe rendering
    const safeString = (val: any) => String(val || "");
    const safeDate = (date: any) => {
        try {
            return new Date(date).toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric' });
        } catch {
            return String(date);
        }
    };

    const getTags = () => {
        if (!blog.tags || blog.tags.length === 0) return [];
        return blog.tags.map((tag: any) => {
            if (tag?.tagId && typeof tag.tagId === 'object' && 'name' in tag.tagId) return tag.tagId.name;
            if (typeof tag === 'object' && 'name' in tag) return tag.name;
            if (typeof tag === 'string') return tag;
            return "Tag";
        });
    };

    return (
        <article className="min-h-screen bg-white dark:bg-black text-black dark:text-white pb-32 selection:bg-black selection:text-white dark:selection:bg-white dark:selection:text-black">

            {/* Reading Progress Bar */}
            <motion.div
                className="fixed top-0 left-0 right-0 h-1 bg-black dark:bg-white origin-left z-50 mix-blend-difference"
                style={{ scaleX }}
            />

            {/* Navigation */}
            <nav className="fixed top-0 w-full z-40 px-6 py-6 flex justify-between items-center mix-blend-difference text-white pointer-events-none">
                <div className="pointer-events-auto">
                    <Link href="/" className="group flex items-center gap-3 text-xs uppercase tracking-[0.2em] hover:opacity-70 transition-opacity text-black dark:text-white mix-blend-difference">
                        <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                        <span className="hidden sm:inline">Back</span>
                    </Link>
                </div>

                <div className="flex gap-6 pointer-events-auto">
                    <button className="hover:scale-110 transition-transform text-black dark:text-white mix-blend-difference">
                        <Share2 className="w-5 h-5" />
                    </button>
                </div>
            </nav>

            {/* Header / Hero Section */}
            <header className="container mx-auto px-4 pt-24 md:pt-32 pb-12 max-w-4xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="flex flex-col items-center text-center space-y-6 md:space-y-8"
                >
                    <div className="flex items-center gap-4 text-[10px] md:text-xs font-medium uppercase tracking-[0.3em] text-zinc-500 dark:text-zinc-400">
                        <span>{safeDate(blog.createdAt)}</span>
                    </div>

                    <h1 className="text-3xl md:text-5xl lg:text-6xl font-light font-serif leading-tight tracking-tight text-balance">
                        {safeString(blog.title)}
                    </h1>

                    <div className="flex flex-wrap justify-center gap-3 opacity-60">
                        {getTags().map((tag: string, i: number) => (
                            <span key={i} className="text-[10px] uppercase tracking-widest border border-zinc-200 dark:border-zinc-800 px-3 py-1 rounded-full">
                                {tag}
                            </span>
                        ))}
                    </div>
                </motion.div>
            </header>

            {/* Hero Image - Contained & Elegant */}
            <div className="container mx-auto px-4 max-w-5xl mb-16 md:mb-24">
                <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="relative w-full shadow-lg overflow-hidden"
                >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src={blog.thumbnail || "/placeholder-blog.jpg"}
                        alt={safeString(blog.title)}
                        className="w-full h-auto object-cover max-h-[85vh]"
                    />
                </motion.div>
            </div>

            {/* Content Body */}
            <div className="container mx-auto px-4 max-w-3xl">
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="prose prose-lg md:prose-xl dark:prose-invert 
                    prose-headings:font-serif prose-headings:font-light 
                    prose-p:font-light prose-p:leading-loose prose-p:text-zinc-600 dark:prose-p:text-zinc-300
                    prose-blockquote:font-serif prose-blockquote:italic prose-blockquote:border-l-2 prose-blockquote:border-black dark:prose-blockquote:border-white prose-blockquote:pl-6 prose-blockquote:ml-0
                    prose-strong:font-medium prose-strong:text-black dark:prose-strong:text-white
                    first-letter:text-5xl first-letter:font-serif first-letter:mr-3 first-letter:float-left first-letter:font-normal first-letter:uppercase
                ">
                    <div dangerouslySetInnerHTML={{ __html: safeString(blog.content) }} />
                </motion.div>

                {/* Article Footer */}
                <div className="mt-32 pt-12 border-t border-zinc-200 dark:border-zinc-800 flex flex-col items-center gap-8">
                    <div className="text-center">
                        <div className="w-16 h-16 mx-auto bg-black dark:bg-white rounded-full flex items-center justify-center text-white dark:text-black font-serif text-2xl italic mb-4">
                            {(() => {
                                const author = (blog as any).author;
                                if (author && author.firstName) {
                                    return author.firstName.charAt(0).toUpperCase();
                                }
                                return "H";
                            })()}
                        </div>
                        <p className="text-xs uppercase tracking-[0.2em] text-zinc-500 mb-2">Curated By</p>
                        <p className="font-serif italic text-2xl">
                            {(() => {
                                const author = (blog as any).author;
                                if (author && (author.firstName || author.lastName)) {
                                    return `${author.firstName || ''} ${author.lastName || ''}`.trim();
                                }
                                return "Hansy Fine Arts";
                            })()}
                        </p>
                    </div>
                </div>
            </div>

            {/* "More Stories" Section */}
            <section className="mt-40 pt-20 pb-20 bg-zinc-50 dark:bg-zinc-900/40">
                <div className="container mx-auto px-4 max-w-7xl">
                    <h3 className="text-4xl font-serif font-light italic text-center mb-16">More Stories</h3>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                        {suggestedBlogs?.data?.filter((b: any) => b._id !== blogId).slice(0, 3).map((item: any, idx: number) => (
                            <Link href={`/blog/${item._id}`} key={item._id} className="group cursor-pointer block">
                                <div className="aspect-[4/5] overflow-hidden mb-6 relative">
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors z-10 duration-500" />
                                    <img
                                        src={item.thumbnail || "/placeholder-blog.jpg"}
                                        alt={safeString(item.title)}
                                        className="w-full h-full object-cover transition-transform duration-[1s] group-hover:scale-105"
                                    />
                                </div>
                                <div className="text-center max-w-sm mx-auto">
                                    <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 mb-3">
                                        {safeDate(item.createdAt)}
                                    </p>
                                    <h4 className="text-xl font-serif italic group-hover:text-zinc-600 transition-colors leading-relaxed">
                                        {safeString(item.title)}
                                    </h4>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>
        </article>
    );
}
