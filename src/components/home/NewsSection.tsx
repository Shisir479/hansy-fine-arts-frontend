import Image from 'next/image';

interface NewsItem {
  title: string;
  date: string;
  comments: number;
  imageUrl: string;
}

const newsData: NewsItem[] = [
  {
    title: '10 Steps: How to Create a Successful Business From Your Art',
    date: 'December 07, 2018',
    comments: 2,
    imageUrl: '/cuadro-vertical-1_1.jpg',
  },
  {
    title: 'Google Launched Virtual Tours of 50 Museums',
    date: 'December 07, 2018',
    comments: 2,
    imageUrl: '/cuadro-vertical-2.jpg',
  },
  {
    title: '10 Facts From the Life of the Most Expensive Artist of Our Time',
    date: 'December 07, 2018',
    comments: 2,
    imageUrl: '/cuadro-vertical-3.jpg',
  },
];

interface NewsCardProps {
  title: string;
  date: string;
  comments: number;
  imageUrl: string;
}

const NewsCard = ({ title, date, comments, imageUrl }: NewsCardProps) => {
  return (
    <div className="border rounded-lg shadow-md overflow-hidden bg-white dark:bg-gray-800">
      <div className="relative w-full h-64">
        <Image
          src={imageUrl}
          alt={title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>
      <div className="p-4">
        <h2 className="text-lg font-bold mb-2 dark:text-white">{title}</h2>
        <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
          <span>{date}</span>
          <span>{comments} comments</span>
        </div>
      </div>
    </div>
  );
};

const NewsSection = () => {
  return (
    <div className="max-w-7xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6 dark:text-white">Our News</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {newsData.map((news, index) => (
          <NewsCard
            key={index}
            title={news.title}
            date={news.date}
            comments={news.comments}
            imageUrl={news.imageUrl}
          />
        ))}
      </div>
    </div>
  );
};

export default NewsSection;
