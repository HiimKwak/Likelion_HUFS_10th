import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getCategoryApi } from "../../../assets/Api";
import { useMenuActions } from "../../../contexts/MenuContext";
import Layout from "../../layout/index";
import Pagination from "../../contents/pagination";
import Loading from "../../../assets/Loading";
import Menu from "../../contents/menu";

const CategoryPage = () => {
  const { categoryID } = useParams();
  const action = useMenuActions();
  const [loading, setLoading] = useState(null);

  const getMenuList = async () => {
    try {
      const res = await getCategoryApi(categoryID);
      action.update(res);
      console.log(res);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    getMenuList();
  }, []);

  return (
    <Layout>
      {loading && <Loading />}
      <Menu />
      <Pagination />
    </Layout>
  );
};

export default CategoryPage;