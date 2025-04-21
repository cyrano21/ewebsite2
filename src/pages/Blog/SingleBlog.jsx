/* eslint-disable react/jsx-no-target-blank */
"use client";


import React, { useEffect, useState } from "react";
import Tags from "../Shop/Tags";
import PageHeader from "../../components/PageHeader";
import { useParams } from "react-router-dom";
import blogList from "../../utilis/blogdata";
import MostPopularPost from "../../components/Sidebar/MostPopularPost";
import { blogSingle01, blogSingle02 } from "../../utilis/imageImports";

const socialList = [
  {
    link: "#",
    iconName: "icofont-facebook",
    className: "facebook",
  },
  {
    link: "#",
    iconName: "icofont-twitter",
    className: "twitter",
  },
  {
    link: "#",
    iconName: "icofont-linkedin",
    className: "linkedin",
  },
  {
    link: "#",
    iconName: "icofont-instagram",
    className: "instagram",
  },
  {
    link: "#",
    iconName: "icofont-pinterest",
    className: "pinterest",
  },
];

const SingleBlog = () => {
  const [blog, setBlog] = useState(blogList);
  const { id } = useParams();
  console.log(Number(id));
  const result = blog.filter((p) => p.id === Number(id));
  console.log(result[0]);
  return (
    <div>
      <PageHeader
        title={"Article de blog"}
        curPage={"Blog / Détails de l'article"}
      />
      <div className="blog-section blog-single padding-tb section-bg">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8 col-12">
              <article>
                <div className="section-wrapper">
                  <div className="row row-cols-1 justify-content-center g-4">
                    <div className="col">
                      <div className="post-item style-2">
                        <div className="post-inner">
                          {result.map((item) => (
                            <div key={item.id}>
                              <div className="post-thumb">
                                <img
                                  src={item.imgUrl}
                                  alt="blog thumb rajibraj91"
                                  className="w-100"
                                />
                              </div>
                              <div className="post-content">
                                <h2>
                                  {item.title}
                                </h2>
                                <div className="meta-post">
                                  <ul className="lab-ul">
                                    <li>
                                      <a href="#">
                                        <i className="icofont-calendar"></i>
                                        23 avril 2021
                                      </a>
                                    </li>
                                    <li>
                                      <a href="#">
                                        <i className="icofont-ui-user"></i>Rajib
                                        Raj
                                      </a>
                                    </li>
                                    <li>
                                      <a href="#">
                                        <i className="icofont-speech-comments"></i>
                                         09 Commentaires
                                      </a>
                                    </li>
                                  </ul>
                                </div>
                                <p>
                                  La sérénité s'est emparée de mon âme entière en ces douces matinées de printemps que je savoure de tout mon cœur. Je me retrouve seul et ressens le charme de l'existence en ce lieu qui fait le bonheur des âmes comme la mienne. Je suis si heureux, mon cher ami, absorbé par ce sentiment exquis, profitant de tout mon cœur seul et ressentant le charme de l'existence en ce lieu qui était le bonheur des âmes comme la mienne. Mon cher ami, absorbé par ce sentiment exquis, cette existence tranquille néglige mes talents, je serais incapable de dessiner une telle sérénité merveilleuse qui s'est emparée de mon âme entière en ces doux moments présents, et pourtant je sens que jamais je ne fus un plus grand artiste.
                                </p>

                                <blockquote>
                                  <p>
                                    Transformez dynamiquement les technologies distribuées là où les canaux clés en main et offrez de manière monotone un accès à l'expertise de nivellement des ressources via des livrables mondiaux qui étendent de manière holistique les portails diversifiés.{" "}
                                  </p>
                                  <cite>
                                    <a href="#">...Melissa Hunter</a>
                                  </cite>
                                </blockquote>

                                <p>
                                  De tout mon cœur, je me crée seul et ressens le charme de l'existence en ce lieu qui fait le bonheur des âmes comme la mienne. Je suis si heureux, mon cher ami, absorbé par ce sentiment exquis, profitant de tout mon cœur seul et ressentant le charme de l'existence en ce lieu qui était le bonheur des âmes comme la mienne. Mon cher ami, absorbé par ce sentiment exquis, cette existence tranquille néglige mes talents, je serais incapable de dessiner une telle sérénité merveilleuse qui s'est emparée de mon âme entière en ces doux moments présents, et pourtant je sens que jamais je ne fus un plus grand artiste.
                                </p>

                                <img
                                  src={blogSingle01}
                                  alt="rajibraj91"
                                />

                                <p>
                                  La sérénité s'est emparée de mon âme entière en ces douces matinées de printemps que je savoure de tout mon cœur. Je me retrouve seul et ressens le charme de l'existence en ce lieu qui fait le bonheur des âmes comme la mienne. Je suis si heureux, mon cher ami, absorbé par ce sentiment exquis, profitant de tout mon cœur seul et ressentant le charme de l'existence en ce lieu qui était le bonheur des âmes comme la mienne. Mon cher ami, absorbé par ce sentiment exquis, cette existence tranquille néglige mes talents, je serais incapable de dessiner une telle sérénité merveilleuse qui s'est emparée de mon âme entière en ces doux moments présents, et pourtant je sens que jamais je ne fus un plus grand artiste.
                                </p>

                                <div className="video-thumb">
                                  <img
                                    src={blogSingle02}
                                    alt="video"
                                  />
                                  <a
                                    href="https://youtu.be/2qWo6W5Wn8Q"
                                    className="video-button popup"
                                    target="_blank"
                                  >
                                    <i className="icofont-ui-play"></i>
                                  </a>
                                </div>

                                <p>
                                  De tout mon cœur, je me crée seul et ressens le charme de l'existence en ce lieu qui fait le bonheur des âmes comme la mienne. Je suis si heureux, mon cher ami, absorbé par ce sentiment exquis, profitant de tout mon cœur seul et ressentant le charme de l'existence en ce lieu qui était le bonheur des âmes comme la mienne. Mon cher ami, absorbé par ce sentiment exquis, cette existence tranquille néglige mes talents, je serais incapable de dessiner une telle sérénité merveilleuse qui s'est emparée de mon âme entière en ces doux moments présents, et pourtant je sens que jamais je ne fus un plus grand artiste.
                                </p>

                                <div className="tags-section">
                                  <ul className="tags lab-ul">
                                    <li>
                                      <a href="#">Agence</a>
                                    </li>
                                    <li>
                                      <a href="#">Entreprise</a>
                                    </li>
                                    <li>
                                      <a href="#">Personnel</a>
                                    </li>
                                  </ul>
                                  <ul className="lab-ul social-icons">
                                    {socialList.map((val, i) => (
                                      <li key={i}>
                                        <a
                                          href={val.link}
                                          className={val.className}
                                        >
                                          <i className={val.iconName}></i>
                                        </a>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="navigations-part">
                        <div className="left">
                          <a href="#" className="prev">
                            <i className="icofont-double-left"></i>Article précédent
                          </a>
                          <a href="#" className="title">
                            Processus parallèles via des modèles techniques sonores faisant autorité
                          </a>
                        </div>
                        <div className="right">
                          <a href="#" className="prev">
                            Article suivant<i className="icofont-double-right"></i>
                          </a>
                          <a href="#" className="title">
                            Processus parallèles via des modèles techniques sonores innovants
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            </div>
            <div className="col-lg-4 col-12">
              <aside>
                <Tags />
                <MostPopularPost/>
              </aside>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleBlog;
