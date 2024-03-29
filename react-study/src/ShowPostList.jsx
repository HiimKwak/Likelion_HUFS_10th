import {
  CursorDiv,
  LoadingDiv,
  LoadingImg,
  PagenumberDiv,
  PagingSection,
  PostListDiv,
  PostSection,
  PostTitle,
  PostTitleDiv,
} from "./styledComponent";

import {
  faArrowLeft,
  faArrowRight,
  faArrowsRotate,
  faPenToSquare,
} from "@fortawesome/free-solid-svg-icons";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import EachPost from "./EachPost";
import { React, useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function ShowPostList({ apiUrl }) {
  const [loading, setLoading] = useState(true);
  const [postList, setPostList] = useState([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState([]);
  const [isFinalPage, setIsFinalPage] = useState();
  const [isFirstPage, setIsFirstPage] = useState();

  const navigate = useNavigate();
  const goWrite = () => {
    navigate("/write");
  };

  const getPostList = useCallback(() => {
    setLoading(true);
    axios.get(`${apiUrl}list/?page=${page}&page_size=10`).then((response) => {
      // 실제 api data 안에 담긴 페이지 수만큼 보이게 하는 작업
      const lastPage = Math.ceil(response.data.count / 10); // data.count를 10으로 나누고 올림하면 마지막 페이지 수
      const tempPages = []; // setPages에 들어갈 배열 껍데기
      for (let i = 1; i <= lastPage; i++) {
        tempPages.push(i); // map함수를 사용해 껍데기 배열에 숫자 차례대로 푸쉬
      }
      setPages(tempPages); // update pages state

      setPostList(response.data.results);
      setLoading(false);

      // 뒤로 가기 / 앞으로 가기 버튼 위한 상태 관리
      setIsFinalPage(response.data.next);
      setIsFirstPage(response.data.previous);
    });
  });

  useEffect(getPostList, [page]); // 사용자가 선택하는 페이지가 달라질 때마다 바뀌게 함

  return (
    <>
      <PostSection>
        <PostTitleDiv>
          <FontAwesomeIcon onClick={getPostList} icon={faArrowsRotate} />
          <PostTitle>익명게시판</PostTitle>
          <CursorDiv>
            <FontAwesomeIcon onClick={goWrite} icon={faPenToSquare} />
          </CursorDiv>
        </PostTitleDiv>
        <PostListDiv>
          {loading ? (
            <LoadingDiv>
              <LoadingImg src={"./loading.svg"} />
            </LoadingDiv>
          ) : postList.length === 0 ? (
            <LoadingDiv>아직 기록된 글이 없습니다.</LoadingDiv>
          ) : (
            <ul>
              {postList.map((element) => (
                <EachPost
                  key={element.id}
                  title={element.title}
                  postID={element.id}
                />
              ))}
            </ul>
          )}
        </PostListDiv>
      </PostSection>
      <PagingSection>
        {isFirstPage ? (
          <PagenumberDiv
            onClick={() => {
              if (page > 1) setPage(page - 1);
            }}
          >
            <FontAwesomeIcon icon={faArrowLeft} />
          </PagenumberDiv>
        ) : (
          ""
        )}

        {pages.map((pageNum) => (
          <PagenumberDiv key={pageNum} onClick={() => setPage(pageNum)}>
            {pageNum}
          </PagenumberDiv>
        ))}

        {isFinalPage ? (
          <PagenumberDiv
            onClick={() => {
              if (pages.length > page) setPage(page + 1);
            }}
          >
            <FontAwesomeIcon icon={faArrowRight} />
          </PagenumberDiv>
        ) : (
          ""
        )}
      </PagingSection>
    </>
  );
}

export default ShowPostList;
