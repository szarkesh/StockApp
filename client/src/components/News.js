import React from 'react';
import styled from 'styled-components';
import Header from './Header'
import FadeIn from 'react-fade-in';
import {DEFAULTSHADOW, API_ENDPOINT} from './Constants'
import KeywordAdder from './KeywordAdder'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background: #FCFCFC
`;

const ArticleContainer = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  border-radius: 15px;
  grid-column-gap: 10px;
  padding: 20px;
  margin: 20px;
  background: #FFFFFF;
  max-width: 800px;
  cursor: pointer;
  box-shadow: ${DEFAULTSHADOW};
`

const Title = styled.div`
  font-size: 20px;
`

const Source = styled.div`
  color: gray;
  font-size: 12px;
`
const Icon = styled.i`
    color: #888888;
    cursor: pointer;
    margin: 10px;
`;

const Icons = styled.div`
    position: absolute;
    right: 20px;
    top: 130px;
    display: flex;
    flex-direction: column;
`;

const Large = styled.div`
    font-size: 35px;
    font-weight: lighter;
    color: #333333;
    margin: 30px;
`

const Article = ({data}) => (
  <FadeIn>
  <ArticleContainer onClick={()=>window.open(data["url"])}>
    <div>
      <Title>{data["title"]}</Title>
      <Source>{data["source"]["name"]}</Source>
    </div>
    <div>
      <img width="100%" src={data["urlToImage"]}/>
    </div>
  </ArticleContainer>
  </FadeIn>
)

function News(){
  let [articles, setArticles] = React.useState([]);
  let [tutorial, setTutorial] = React.useState(false);
  let [keywords, setKeywords] = React.useState([]);

  const fetchNews = () => {
      console.log('fetching news');
      setArticles([]);
      if(keywords.length > 0){
          let url = 'https://newsapi.org/v2/everything?q=' + keywords.join(' OR ') + '&language=en' + '&apiKey=6610bfddfeec4fc5880296e6522bbd00&pageSize=100'
          fetch(url).then((res)=>res.json()).then((data)=>{
              if(data.articles){
                  setArticles(data.articles);
                  console.log(data.articles)
              }
              else{
                console.log("error fetching articles")
              }
          })
          setTutorial(false);
      }
  }
  React.useEffect(()=>{
     fetch(`${API_ENDPOINT}/api/topics`,{
         credentials:"include"
     }).then((res)=>res.json()).then((data)=>{
         console.log('data is ' + JSON.stringify(data));
         if(data['topics'].length===0){
             setTutorial(true);
         }
         else{
             setKeywords(data['topics']);
         }
     })
 }, []);

 React.useEffect(()=>{
     console.log(keywords);
     fetchNews();
 }, [keywords])
  return (
    <Container>
      <Header>News</Header>
      {tutorial ?
          <div>
              <Large>Let's find you some articles.</Large>
              <KeywordAdder sendBack={setKeywords}/>
          </div> :
          <div style={{marginRight:"100px", fontSize:"20px"}}>
            <Icons>
                <Icon onClick={()=>fetchNews()} className="fa fa-refresh"></Icon>
                <Icon onClick={()=>setTutorial(true)} className="fa fa-cog"></Icon>
            </Icons>
            {articles.map((item)=><Article data={item}/>)}
          </div>
      }
    </Container>
  )
}

export default News;
