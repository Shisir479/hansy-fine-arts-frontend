'use client';

import { useEffect, useState } from 'react';
import { Tab, TabList, TabPanel, Tabs } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import CategoryCard from '@/components/shop/CategoryCard';
import { Product } from '@/types/product';
import axios from 'axios';

const TabCategories = () => {
  const [arts, setArts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAllProducts();
  }, []);

  const fetchAllProducts = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/arts`
      );
      setArts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Tabs>
      <div className="max-w-7xl px-6 py-10 mx-auto">
        <h1 className="text-2xl font-semibold text-center text-gray-800 capitalize lg:text-3xl dark:text-white">
          Browse Arts By Categories
        </h1>

        <p className="max-w-2xl mx-auto my-6 text-center text-gray-500 dark:text-gray-300">
          Four categories available for Fine Arts. Browse Contemporary, Abstract & Design,
          Custom Portrait, and Artsy Products by clicking on the tabs below.
        </p>

        <div className="flex items-center justify-center">
          <TabList>
            <Tab>Contemporary</Tab>
            <Tab>Abstract & Design</Tab>
            <Tab>Custom Portrait</Tab>
            <Tab>Artsy Product</Tab>
          </TabList>
        </div>

        {loading ? (
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
          </div>
        ) : (
          <>
            <TabPanel>
              <div className="grid grid-cols-1 gap-8 mt-8 xl:mt-16 md:grid-cols-2 lg:grid-cols-3">
                {arts
                  .filter((art) => art.category === 'contemporary')
                  .slice(0, 6)
                  .map((art) => (
                    <CategoryCard key={art._id} product={art} />
                  ))}
              </div>
            </TabPanel>

            <TabPanel>
              <div className="grid grid-cols-1 gap-8 mt-8 xl:mt-16 md:grid-cols-2 lg:grid-cols-3">
                {arts
                  .filter((art) => art.category === 'abstract')
                  .slice(0, 6)
                  .map((art) => (
                    <CategoryCard key={art._id} product={art} />
                  ))}
              </div>
            </TabPanel>

            <TabPanel>
              <div className="grid grid-cols-1 gap-8 mt-8 xl:mt-16 md:grid-cols-2 lg:grid-cols-3">
                {arts
                  .filter((art) => art.category === 'portrait')
                  .slice(0, 6)
                  .map((art) => (
                    <CategoryCard key={art._id} product={art} />
                  ))}
              </div>
            </TabPanel>

            <TabPanel>
              <div className="grid grid-cols-1 gap-8 mt-8 xl:mt-16 md:grid-cols-2 lg:grid-cols-3">
                {arts
                  .filter((art) => art.category === 'artsy')
                  .slice(0, 6)
                  .map((art) => (
                    <CategoryCard key={art._id} product={art} />
                  ))}
              </div>
            </TabPanel>
          </>
        )}
      </div>
    </Tabs>
  );
};

export default TabCategories;
