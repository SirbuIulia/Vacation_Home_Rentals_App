import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { categories, types, facilities } from "../data";
import "../styles/EditListing.scss";
import { RemoveCircleOutline, AddCircleOutline } from "@mui/icons-material";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { IoIosImages } from "react-icons/io";
import { BiTrash } from "react-icons/bi";

const EditListing = () => {
    const { listingId } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        category: '',
        type: '',
        streetAddress: '',
        aptSuite: '',
        city: '',
        province: '',
        country: '',
        guestCount: 1,
        bedroomCount: 1,
        bedCount: 1,
        bathroomCount: 1,
        amenities: [],
        title: '',
        description: '',
        highlight: '',
        highlightDesc: '',
        price: '',
        photos: [],
    });
    const [photos, setPhotos] = useState([]);
    const [photosToRemove, setPhotosToRemove] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchListingDetails = async () => {
            setLoading(true);
            try {
                const response = await fetch(`http://localhost:3001/properties/${listingId}`);
                const listing = await response.json();
                setFormData(prevState => ({
                    ...prevState,
                    ...listing,
                    amenities: [...new Set(listing.amenities || [])],
                    photos: listing.listingPhotoPaths || [],
                }));
                setPhotos(listing.listingPhotoPaths || []);
            } catch (error) {
                console.error("Failed to fetch listing details:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchListingDetails();
    }, [listingId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({ ...prevState, [name]: value }));
    };

    const handleCategoryChange = (category) => {
        setFormData(prevState => ({ ...prevState, category }));
    };

    const handleTypeChange = (type) => {
        setFormData(prevState => ({ ...prevState, type }));
    };

    const handleAmenityChange = (amenity) => {
        setFormData(prevState => {
            const updatedAmenities = new Set(prevState.amenities);
            if (updatedAmenities.has(amenity)) {
                updatedAmenities.delete(amenity);
            } else {
                updatedAmenities.add(amenity);
            }
            return { ...prevState, amenities: Array.from(updatedAmenities) };
        });
    };

    const handleUploadPhotos = (e) => {
        const files = Array.from(e.target.files);
        setPhotos(prevPhotos => [...prevPhotos, ...files]);
    };

    const handleRemovePhoto = (indexToRemove) => {
        const photoToRemove = photos[indexToRemove];
        if (typeof photoToRemove === 'string') {
            setPhotosToRemove(prevPhotosToRemove => [...prevPhotosToRemove, photoToRemove]);
        }
        setPhotos(prevPhotos => prevPhotos.filter((_, index) => index !== indexToRemove));
    };

    const handleDragPhoto = (result) => {
        if (!result.destination) return;

        const items = Array.from(photos);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);

        setPhotos(items);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const form = new FormData();
        form.append("category", formData.category);
        form.append("type", formData.type);
        form.append("streetAddress", formData.streetAddress);
        form.append("aptSuite", formData.aptSuite);
        form.append("city", formData.city);
        form.append("province", formData.province);
        form.append("country", formData.country);
        form.append("guestCount", formData.guestCount);
        form.append("bedroomCount", formData.bedroomCount);
        form.append("bedCount", formData.bedCount);
        form.append("bathroomCount", formData.bathroomCount);
        form.append("amenities", formData.amenities.join(','));
        form.append("title", formData.title);
        form.append("description", formData.description);
        form.append("highlight", formData.highlight);
        form.append("price", formData.price);
        form.append("photosToRemove", JSON.stringify(photosToRemove));

        photos.forEach(photo => {
            if (typeof photo !== 'string') {
                form.append('listingPhotos', photo);
            }
        });

        try {
            const response = await fetch(`http://localhost:3001/properties/${listingId}`, {
                method: 'PUT',
                body: form,
            });
            if (!response.ok) {
                const errorMessage = await response.text();
                throw new Error(errorMessage || 'Failed to update the listing');
            }
            navigate(`/properties/${listingId}`);
        } catch (error) {
            console.error("Failed to update the listing:", error.message);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <>
            <Navbar />
            <div className="edit-listing">
                <h1>Editează-ți anunțul</h1>
                <form onSubmit={handleSubmit} className="edit-form">
                    <div className="form-group">
                        <h3>Categorie:</h3>
                        <div className="category-list">
                            {categories.map((cat, index) => (
                                <div
                                    className={`category ${formData.category === cat.label ? "selected" : ""}`}
                                    key={index}
                                    onClick={() => handleCategoryChange(cat.label)}
                                    style={{ border: formData.category === cat.label ? '2px solid red' : '1px solid #ccc' }}
                                >
                                    <div className="category_icon">{cat.icon}</div>
                                    <p>{cat.label}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="form-group">
                        <h3>Tip:</h3>
                        <div className="type-list">
                            {types.map((type, index) => (
                                <div
                                    className={`type ${formData.type === type.name ? "selected" : ""}`}
                                    key={index}
                                    onClick={() => handleTypeChange(type.name)}
                                    style={{ border: formData.type === type.name ? '2px solid red' : '1px solid #ccc' }}
                                >
                                    <div className="type_text">
                                        <h4>{type.name}</h4>
                                        <p>{type.description}</p>
                                    </div>
                                    <div className="type_icon">{type.icon}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="form-group">
                        <h3>Titlu:</h3>
                        <input id="title" name="title" type="text" value={formData.title} onChange={handleChange} className="styled-input" />
                    </div>

                    <div className="form-group">
                        <h3>Stradă:</h3>
                        <input
                            id="streetAddress"
                            name="streetAddress"
                            type="text"
                            value={formData.streetAddress}
                            onChange={handleChange}
                            className="styled-input"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <h3>Apt/Suită/etc:</h3>
                        <input
                            id="aptSuite"
                            name="aptSuite"
                            type="text"
                            value={formData.aptSuite}
                            onChange={handleChange}
                            className="styled-input"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <h3>Oraș:</h3>
                        <input
                            id="city"
                            name="city"
                            type="text"
                            value={formData.city}
                            onChange={handleChange}
                            className="styled-input"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <h3>Județ:</h3>
                        <input
                            id="province"
                            name="province"
                            type="text"
                            value={formData.province}
                            onChange={handleChange}
                            className="styled-input"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <h3>Țară:</h3>
                        <input
                            id="country"
                            name="country"
                            type="text"
                            value={formData.country}
                            onChange={handleChange}
                            className="styled-input"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <h3>Număr oaspeți:</h3>
                        <div className="count-control">
                            <RemoveCircleOutline onClick={() => setFormData(prevState => ({ ...prevState, guestCount: Math.max(1, prevState.guestCount - 1) }))} />
                            <input
                                id="guestCount"
                                name="guestCount"
                                type="number"
                                value={formData.guestCount}
                                onChange={handleChange}
                                required
                            />
                            <AddCircleOutline onClick={() => setFormData(prevState => ({ ...prevState, guestCount: prevState.guestCount + 1 }))} />
                        </div>
                    </div>

                    <div className="form-group">
                        <h3>Număr camere:</h3>
                        <div className="count-control">
                            <RemoveCircleOutline onClick={() => setFormData(prevState => ({ ...prevState, bedroomCount: Math.max(1, prevState.bedroomCount - 1) }))} />
                            <input
                                id="bedroomCount"
                                name="bedroomCount"
                                type="number"
                                value={formData.bedroomCount}
                                onChange={handleChange}
                                required
                                className="input"
                            />
                            <AddCircleOutline onClick={() => setFormData(prevState => ({ ...prevState, bedroomCount: prevState.bedroomCount + 1 }))} />
                        </div>
                    </div>

                    <div className="form-group">
                        <h3>Număr paturi:</h3>
                        <div className="count-control">
                            <RemoveCircleOutline onClick={() => setFormData(prevState => ({ ...prevState, bedCount: Math.max(1, prevState.bedCount - 1) }))} />
                            <input
                                id="bedCount"
                                name="bedCount"
                                type="number"
                                value={formData.bedCount}
                                onChange={handleChange}
                                required
                                className="input"
                            />
                            <AddCircleOutline onClick={() => setFormData(prevState => ({ ...prevState, bedCount: prevState.bedCount + 1 }))} />
                        </div>
                    </div>

                    <div className="form-group">
                        <h3>Număr băi:</h3>
                        <div className="count-control">
                            <RemoveCircleOutline onClick={() => setFormData(prevState => ({ ...prevState, bathroomCount: Math.max(1, prevState.bathroomCount - 1) }))} />
                            <input
                                id="bathroomCount"
                                name="bathroomCount"
                                type="number"
                                value={formData.bathroomCount}
                                onChange={handleChange}
                                required
                                className="input"
                            />
                            <AddCircleOutline onClick={() => setFormData(prevState => ({ ...prevState, bathroomCount: prevState.bathroomCount + 1 }))} />
                        </div>
                    </div>

                    <div className="form-group">
                        <h3>Facilități:</h3>
                        <div className="amenities">
                            {facilities.map((item, index) => (
                                <div
                                    className={`facility ${formData.amenities.includes(item.name) ? "selected" : ""}`}
                                    key={index}
                                    onClick={() => handleAmenityChange(item.name)}
                                    style={{ border: formData.amenities.includes(item.name) ? '2px solid red' : '1px solid #ccc' }}
                                >
                                    <div className="facility_icon">{item.icon}</div>
                                    <p>{item.name}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="form-group">
                        <h3>Fotografii:</h3>
                        <DragDropContext onDragEnd={handleDragPhoto}>
                            <Droppable droppableId="photos" direction="horizontal">
                                {(provided) => (
                                    <div
                                        className="photos"
                                        {...provided.droppableProps}
                                        ref={provided.innerRef}
                                    >
                                        {photos.length === 0 ? (
                                            <>
                                                <input
                                                    id="image"
                                                    type="file"
                                                    style={{ display: "none" }}
                                                    accept="image/*"
                                                    onChange={handleUploadPhotos}
                                                    multiple
                                                />
                                                <label htmlFor="image" className="alone">
                                                    <div className="icon">
                                                        <IoIosImages />
                                                    </div>
                                                    <p>Încarcă din dispozitiv</p>
                                                </label>
                                            </>
                                        ) : (
                                            <>
                                                {photos.map((photo, index) => (
                                                    <Draggable
                                                        key={index}
                                                        draggableId={index.toString()}
                                                        index={index}
                                                    >
                                                        {(provided) => (
                                                            <div
                                                                className="photo"
                                                                ref={provided.innerRef}
                                                                {...provided.draggableProps}
                                                                {...provided.dragHandleProps}
                                                            >
                                                                <img
                                                                    src={typeof photo === 'string' ? `http://localhost:3001/${photo}` : URL.createObjectURL(photo)}
                                                                    alt="loc"
                                                                />
                                                                <button
                                                                    type="button"
                                                                    onClick={() => handleRemovePhoto(index)}
                                                                >
                                                                    <BiTrash />
                                                                </button>
                                                            </div>
                                                        )}
                                                    </Draggable>
                                                ))}
                                                <input
                                                    id="image"
                                                    type="file"
                                                    style={{ display: "none" }}
                                                    accept="image/*"
                                                    onChange={handleUploadPhotos}
                                                    multiple
                                                />
                                                <label htmlFor="image" className="together">
                                                    <div className="icon">
                                                        <IoIosImages />
                                                    </div>
                                                    <p>Încarcă din dispozitiv</p>
                                                </label>
                                            </>
                                        )}
                                    </div>
                                )}
                            </Droppable>
                        </DragDropContext>
                    </div>

                    <div className="form-group">
                        <h3>Descriere:</h3>
                        <input
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            className="styled-input"
                            placeholder="Descriere"
                            required
                        />
                        <h3>Descriere pe scurt:</h3>
                        <input
                            id="highlight"
                            name="highlight"
                            type="text"
                            value={formData.highlight}
                            onChange={handleChange}
                            className="styled-input"
                            placeholder="Descriere pe scurt"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <h3>Preț:</h3>
                        <input
                            id="price"
                            name="price"
                            type="number"
                            value={formData.price}
                            onChange={handleChange}
                            className="styled-input"
                            required
                        />
                    </div>

                    <button className="submit" type="submit">Salvează Modificările</button>
                </form>
            </div>
            <Footer />
        </>
    );
};

export default EditListing;
