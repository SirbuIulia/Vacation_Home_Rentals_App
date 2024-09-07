import { categories } from "../data";
import "../styles/Categories.scss";
import { Link } from "react-router-dom";

const Categories = () => {
    return (
        <div className="categories">
            <h1>Explorează categoriile principale</h1>
            <p>
                Explorează gama noastră largă de închirieri pentru vacanță, care se adresează tuturor tipurilor
                de călători. Lăsați-vă cuprinși de cultura locală, bucurați-vă de confortul casei și creați amintiri
                de neuitat în destinația visurilor voastre.
            </p>

            <div className="categories_list">
                {categories?.slice(1, 6).map((category, index) => (
                    <Link to={`/properties/category/${category.label}`} key={index}>
                        <div className="category">
                            <img src={category.img} alt={category.label} />
                            <div className="overlay"></div>
                            <div className="category_text">
                                <div className="category_text_icon">{category.icon}</div>
                                <p>{category.label}</p>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default Categories;
