import RSS from 'rss';
import nodeFetch from 'node-fetch';

export const rss = async (event, context) => {

    const feed = new RSS({
        title: process.env.DOMAIN,
        description: process.env.DESCRIPTION,
        feed_url: process.env.RSS_URL,
        site_url: process.env.SITE_URL,
        copyright: process.env.COPYRIGHT,
        language: process.env.LANG,
        ttl: process.env.TTL
    });

    const post = await getPosts();

    post.map(post => {
        feed.item({
            guid: post._id,
            title: post.title,
            date: post.publishedAt,
            url: post.url
        });

    });

    const xml = feed.xml({ident: true});
    return {
        statusCode: 200,
        headers: {
            'Content-Type': 'application/xml',
        },
        body: xml,
    };

};

async function getPosts() {
    const res = await nodeFetch(process.env.POST_ENDPOINT)
        .catch(e => console.log('failed to fetch posts.'));
    const posts = await res.json().catch(e => console.log('failed to parse json'));
    return posts.entries.map(post => {
        return {
            ...post,
            url: generatePostUrl(post)
        };
    });
}

const generatePostUrl = (post) => {
    return `https://${process.env.DOMAIN}/#/posts/${post._id}`;
};
