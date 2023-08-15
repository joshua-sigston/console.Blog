const newsAPI = async () => {
  let articles = []
  const url = 'https://bing-news-search1.p.rapidapi.com/news/search?q=web%20development&freshness=Day&textFormat=Raw&safeSearch=Off';
  const options = {
    method: 'GET',
    headers: {
      'X-BingApis-SDK': 'true',
      'X-RapidAPI-Key': `${process.env.API_KEY}`,
      'X-RapidAPI-Host': 'bing-news-search1.p.rapidapi.com'
    }
  };

  try {
    const response = await fetch(url, options);
    const result = await response.json();
    await result.value.forEach( item => articles.push(item))
  } catch (error) {
    console.error(error);
  }

  return articles
}

module.exports = { newsAPI }