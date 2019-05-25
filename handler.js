import RSS from 'rss';
import nodeFetch from 'node-fetch';

export const rss = async (event, context) => {
  console.log('generating RSS');

  const feed = new RSS({
    title: process.env.DOMAIN,
    description: 'a blog about programming',
    feed_url: process.env.RSS_URL,
    site_url: process.env.SITE_URL,
    copyright: `2019 ${process.env.SITE_URL}`,
    language: 'en',
    categories: ['programming', 'technology', 'blog'],
    ttl: '60'
  });

  const post = await getPosts(); 
  
  post.map( post => {
  	feed.item({
		id: post._id,
		title: post.title,
		description: post.contentquestion
	});
  
  });
    

  return {
    isBase64Encoded: false,
    statusCode: 200,
    headers: {
	'Content-Type': 'application/rss+xml'
    },
    body: feed.xml() 
   
  };
};


async function getPosts() {
  const res =  await nodeFetch(process.env.POST_ENDPOINT)
        .catch( e => console.log('failed to fetch posts.'));
  const posts = await res.json().catch(e => console.log('failed to parse json'));
  return posts.entries.map( post => {
    return {
        ...post,
        url: generatePostUrl(post)
    };
  });
}

const generatePostUrl = (post) => {
  return `https://${process.env.DOMAIN}/#/posts/${post._id}`;
};
