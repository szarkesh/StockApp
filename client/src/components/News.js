import React from 'react';
import styled from 'styled-components';
import Header from './Header'
import FadeIn from 'react-fade-in';
import {DEFAULTSHADOW} from './Constants'

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
  React.useEffect(()=>{
    fetch('http://newsapi.org/v2/everything?q=finance&apiKey=6610bfddfeec4fc5880296e6522bbd00').then((res)=>res.json()).then((data)=>{
        if(data.articles){
            setArticles(data.articles);
        }
        else{
          console.log("error fetching articles")
        }
    })
  }, [])
  return (
    <Container>
      <Header>News</Header>
      <div style={{marginRight:"100px", fontSize:"20px"}}>
        {articles.map((item)=><Article data={item}/>)}
      </div>
    </Container>
  )
}

export default News;
