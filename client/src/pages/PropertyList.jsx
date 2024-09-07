import "../styles/List.scss";
import { useDispatch, useSelector } from "react-redux";
import Navbar from "../components/Navbar";
import ListingCard from "../components/ListingCard";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { setPropertyList } from "../redux/state";
import Loader from "../components/Loader";
import Footer from "../components/Footer";
import Swal from 'sweetalert2'

const PropertyList = () => {
    const [loading, setLoading] = useState(true);
    const user = useSelector((state) => state.user);
    const propertyList = user?.propertyList;
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const getPropertyList = async () => {
        try {
            const response = await fetch(`http://localhost:3001/users/${user._id}/properties`, {
                method: "GET"
            })
            const data = await response.json()
            console.log(data)
            dispatch(setPropertyList(data))
            setLoading(false)
        } catch (err) {
            console.log("Fetch all properties failed", err.message)
        }
    }
    useEffect(() => {
        getPropertyList()
    }, [])
    const handleEdit = (id) => {
        navigate(`/edit-property/${id}`);
    };

    const handleDelete = (id) => {
        Swal.fire({
            icon: 'warning',
            title: 'Ești sigur că vrei să ștergi această proprietate?',
            showCancelButton: true,
            confirmButtonText: 'Da, șterge',
            cancelButtonText: 'Anulează',
        }).then((result) => {
            if (result.isConfirmed) {
                fetch(`http://localhost:3001/properties/delete/${id}`, { method: "DELETE" })
                    .then(async response => {
                        if (!response.ok) {
                            return response.json().then(body => Promise.reject(new Error(body.message)));
                        }
                        return response.text();
                    })
                    .then(() => {
                        const updatedProperties = propertyList.filter(property => property._id !== id);
                        dispatch(setPropertyList(updatedProperties));
                        Swal.fire({
                            icon: 'success',
                            title: 'Listing deleted successfully',
                            showConfirmButton: false,
                            timer: 1500
                        });
                        navigate('/');
                    })
                    .catch(error => {
                        console.error('Error deleting listing:', error);
                        alert(`Error: ${error.message}`);
                    });
            }
        });
    };




    return loading ? <Loader /> : (
        <>
            <Navbar />
            <h1 className="title-list">Proprietățile tale</h1>
            <div className="list">
                {propertyList?.map(
                    ({
                        _id,
                        creator,
                        listingPhotoPaths,
                        city,
                        province,
                        country,
                        category,
                        type,
                        price,
                        booking = false,
                    }) => (
                        <ListingCard
                            // key={_id}
                            listingId={_id}
                            creator={creator}
                            listingPhotoPaths={listingPhotoPaths}
                            city={city}
                            province={province}
                            country={country}
                            category={category}
                            type={type}
                            price={price}
                            booking={booking}
                            showActionButtons={true}
                            isPropertyList={true}
                            showLikeIcon={true}
                            onEdit={() => handleEdit(_id)}
                            onDelete={() => handleDelete(_id)}

                        />

                    )
                )}
            </div>

            <Footer />
        </>
    );
};

export default PropertyList;