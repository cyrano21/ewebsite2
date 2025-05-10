import Link from "next/link";
import { blog09, blog10, blog11, blog12 } from "../../utils/imageImports";

const title = "Articles les plus populaires";

const postList = [
    {
        id:1,
        imgUrl: blog10,
        imgAlt: 'rajibraj91',
        title: 'Campagne pour les défavorisés - Nos ressources',
        date: '05 juin 2022',
    },
    {
        id:2,
        imgUrl: blog11,
        imgAlt: 'rajibraj91',
        title: 'Campagne solidarité - Nos ressources',
        date: '05 juin 2022',
    },
    {
        id:3,
        imgUrl: blog12,
        imgAlt: 'rajibraj91',
        title: 'Actions sociales - Nos ressources',
        date: '05 juin 2022',
    },
    {
        id:4,
        imgUrl: blog09,
        imgAlt: 'rajibraj91',
        title: 'Programme d\'aide - Nos ressources',
        date: '05 juin 2022',
    },
]

const PopularPost = () => {
    return (
        <div className="widget widget-post">
            <div className="widget-header">
                <h5 className="title">{title}</h5>
            </div>
            <ul className="widget-wrapper">
                {postList.map((blog, i) => (
                    <li className="d-flex flex-wrap justify-content-between" key={i}>
                        <div className="post-thumb">
                            <Link href={`/blog/${blog.id}`} legacyBehavior><img src={`${blog.imgUrl}`} alt={`${blog.imgAlt}`} /></Link>
                        </div>
                        <div className="post-content">
                            <Link href={`/blog/${blog.id}`} legacyBehavior><h6>{blog.title}</h6></Link>
                            <p>{blog.date}</p>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}
 
export default PopularPost;
