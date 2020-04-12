import React from 'react';
import styled from 'styled-components';
import Header from './Header'
import FadeIn from 'react-fade-in';
import {DEFAULTSHADOW, API_ENDPOINT, PRIMARY} from './Constants'
import KeywordAdder from './KeywordAdder'
import BounceLoader from "react-spinners/BounceLoader";

const Container = styled.div`
  display: flex;
  margin-top: 30px;
  flex-direction: column;
  align-items: center;
  background: #FCFCFC
`;

const LoaderContainer = styled.div`
  height: 30vh;
  display: flex;
  justify-content: center;
  align-items: center;
`

const ArticleContainer = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  border-radius: 15px;
  grid-column-gap: 10px;
  height: 200px;
  margin: 10px;
  background: #FFFFFF;
  max-width: 550px;
  cursor: pointer;
  box-shadow: ${DEFAULTSHADOW};
  .text{
    padding: 20px;
  }
  .imageContainer{
      position: relative;
  }
  div img{
      border-radius: 0px 15px 15px 0px;
      width: 100%;
      height: 100%;
      object-fit: cover;
  }
`

const Title = styled.div`
  font-size: 20px;
  margin-bottom:10px;
`

const Source = styled.div`
  color: #AAAAAA;
  text-transform: uppercase;
  font-size: 14px;
  font-weight: bold;
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

const sources = ['Reuters', 'Bloomberg', 'Forbes', 'CNN Money']

const Article = ({data}) => (
  <FadeIn>
  <ArticleContainer onClick={()=>window.open(data["url"])}>
    <div className="text">
      <Title>{data["title"]}</Title>
      <Source>{sources[Math.floor(Math.random() * 4)]}<span style={{margin:"10px"}}>&#8226;</span>{new Date(data["publishedAt"]).toLocaleString([],{month:"numeric", day:"numeric", hour:"numeric", minute:"2-digit", hour12:"true"})}</Source>
    </div>
    <div className="imageContainer">
      <img width="100%" src={data["urlToImage"]}/>
    </div>
  </ArticleContainer>
  </FadeIn>
)

function News(){
  let [articles, setArticles] = React.useState([]);
  let [tutorial, setTutorial] = React.useState(false);
  let [isLoading, setIsLoading] = React.useState(true);
  let [keywords, setKeywords] = React.useState([]);

  const fetchNews = () => {
      console.log('fetching news');
      setArticles([]);
      if(keywords.length > 0){
          let url = 'https://newsapi.org/v2/everything?q=' + keywords.join(' OR ') + '&language=en' + '&apiKey=6610bfddfeec4fc5880296e6522bbd00&pageSize=100'
          console.log(url);
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
     fetch(`/api/topics`,{
         credentials:"include"
     }).then((res)=>res.json()).then((data)=>{
         console.log('data is ' + JSON.stringify(data));
         if(data['topics'].length===0){
             setIsLoading(false);
             setTutorial(true);
         }
         else{
             setIsLoading(false);
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
      {isLoading && <LoaderContainer><BounceLoader color={PRIMARY}/></LoaderContainer>}
      {tutorial ?
          <div>
              <Large>Let's find you some articles.</Large>
              <KeywordAdder sendBack={setKeywords}/>
          </div> :
          <div style={{marginRight:"100px", flexDirection:"row", width: "100%",display:"flex", flexWrap:"wrap", justifyContent:"center",fontSize:"20px"}}>
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
