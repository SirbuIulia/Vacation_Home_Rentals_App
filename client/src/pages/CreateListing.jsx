import "../styles/CreateListing.scss";
import Navbar from "../components/Navbar";
import { categories, types, facilities } from "../data";
import { RemoveCircleOutline, AddCircleOutline } from "@mui/icons-material";
import variables from "../styles/variables.scss";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { IoIosImages } from "react-icons/io";
import { useState } from "react";
import { BiTrash } from "react-icons/bi";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer"

const CreateListing = () => {
    const [category, setCategory] = useState("");
    const [type, setType] = useState("");

    const [formLocation, setFormLocation] = useState({
        streetAddress: "",
        aptSuite: "",
        city: "",
        province: "",
        country: "",
    });

    const handleChangeLocation = (e) => {
        const { name, value } = e.target;
        setFormLocation({
            ...formLocation,
            [name]: value,
        });
    };

    const [guestCount, setGuestCount] = useState(1);
    const [bedroomCount, setBedroomCount] = useState(1);
    const [bedCount, setBedCount] = useState(1);
    const [bathroomCount, setBathroomCount] = useState(1);

    const [amenities, setAmenities] = useState([]);

    const handleSelectAmenities = (facility) => {
        if (amenities.includes(facility)) {
            setAmenities((prevAmenities) =>
                prevAmenities.filter((option) => option !== facility)
            );
        } else {
            setAmenities((prev) => [...prev, facility]);
        }
    };

    const [photos, setPhotos] = useState([]);

    const handleUploadPhotos = (e) => {
        const newPhotos = e.target.files;
        setPhotos((prevPhotos) => [...prevPhotos, ...newPhotos]);
    };

    const handleDragPhoto = (result) => {
        if (!result.destination) return;

        const items = Array.from(photos);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);

        setPhotos(items);
    };

    const handleRemovePhoto = (indexToRemove) => {
        setPhotos((prevPhotos) =>
            prevPhotos.filter((_, index) => index !== indexToRemove)
        );
    };

    const [formDescription, setFormDescription] = useState({
        title: "",
        description: "",
        highlight: "",
        highlightDesc: "",
        price: "",
    });

    const handleChangeDescription = (e) => {
        const { name, value } = e.target;
        setFormDescription({
            ...formDescription,
            [name]: value,
        });
    };

    const creatorId = useSelector((state) => state.user._id);

    const navigate = useNavigate();

    const handlePost = async (e) => {
        e.preventDefault();
        if (!creatorId) {
            console.log("User must be logged in to create a listing.");
            return;
        }

        try {
            const listingForm = new FormData();
            listingForm.append("creator", creatorId);
            listingForm.append("category", category);
            listingForm.append("type", type);
            listingForm.append("streetAddress", formLocation.streetAddress);
            listingForm.append("aptSuite", formLocation.aptSuite);
            listingForm.append("city", formLocation.city);
            listingForm.append("province", formLocation.province);
            listingForm.append("country", formLocation.country);
            listingForm.append("guestCount", guestCount);
            listingForm.append("bedroomCount", bedroomCount);
            listingForm.append("bedCount", bedCount);
            listingForm.append("bathroomCount", bathroomCount);
            listingForm.append("amenities", amenities);
            listingForm.append("title", formDescription.title);
            listingForm.append("description", formDescription.description);
            listingForm.append("highlight", formDescription.highlight);
            listingForm.append("price", formDescription.price);

            photos.forEach((photo) => {
                listingForm.append("listingPhotos", photo);
            });

            const response = await fetch("http://localhost:3001/properties/create", {
                method: "POST",
                body: listingForm,
                headers: {
                },
            });

            if (response.ok) {
                navigate("/");
            }
        } catch (err) {
            console.log("Publish Listing failed", err.message);
        }
    };
    return (
        <>
            <Navbar />


            <div className="create-listing">
                <h1>Publică anunțul tău</h1>
                <form onSubmit={handlePost}>
                    <div className="create-listing_step1">
                        <h2>Pasul 1: Spune-ne despre locația ta</h2>
                        <hr />
                        <h3>Care dintre aceste categorii descrie cel mai bine locația ta?</h3>
                        <div className="category-list">
                            {categories?.map((item, index) => (
                                <div
                                    className={`category ${category === item.label ? "selected" : ""
                                        }`}
                                    key={index}
                                    onClick={() => setCategory(item.label)}
                                >
                                    <div className="category_icon">{item.icon}</div>
                                    <p>{item.label}</p>
                                </div>
                            ))}
                        </div>

                        <h3>Ce tip de locație vor avea oaspeții?</h3>
                        <div className="type-list">
                            {types?.map((item, index) => (
                                <div
                                    className={`type ${type === item.name ? "selected" : ""}`}
                                    key={index}
                                    onClick={() => setType(item.name)}
                                >
                                    <div className="type_text">
                                        <h4>{item.name}</h4>
                                        <p>{item.description}</p>
                                    </div>
                                    <div className="type_icon">{item.icon}</div>
                                </div>
                            ))}
                        </div>

                        <h3>Unde este situată locația ta?</h3>
                        <div className="full">
                            <div className="location">
                                <p>Adresa</p>
                                <input
                                    type="text"
                                    placeholder="Adresa"
                                    name="streetAddress"
                                    value={formLocation.streetAddress}
                                    onChange={handleChangeLocation}
                                    required
                                />
                            </div>
                        </div>

                        <div className="half">
                            <div className="location">
                                <p>Apartament, Suită, etc. (dacă este cazul)</p>
                                <input
                                    type="text"
                                    placeholder="Apartament, Suită, etc. (dacă este cazul)"
                                    name="aptSuite"
                                    value={formLocation.aptSuite}
                                    onChange={handleChangeLocation}
                                    required
                                />
                            </div>
                            <div className="location">
                                <p>Oraș</p>
                                <input
                                    type="text"
                                    placeholder="Oraș"
                                    name="city"
                                    value={formLocation.city}
                                    onChange={handleChangeLocation}
                                    required
                                />
                            </div>
                        </div>

                        <div className="half">
                            <div className="location">
                                <p>Județ</p>
                                <input
                                    type="text"
                                    placeholder="Provincie"
                                    name="province"
                                    value={formLocation.province}
                                    onChange={handleChangeLocation}
                                    required
                                />
                            </div>
                            <div className="location">
                                <p>Țară</p>
                                <input
                                    type="text"
                                    placeholder="Țară"
                                    name="country"
                                    value={formLocation.country}
                                    onChange={handleChangeLocation}
                                    required
                                />
                            </div>
                        </div>

                        <h3>Împărtășește câteva detalii de bază despre locația ta</h3>
                        <div className="basics">
                            <div className="basic">
                                <p>Oaspeți</p>
                                <div className="basic_count">
                                    <RemoveCircleOutline
                                        onClick={() => {
                                            guestCount > 1 && setGuestCount(guestCount - 1);
                                        }}
                                        sx={{
                                            fontSize: "25px",
                                            cursor: "pointer",
                                            "&:hover": { color: variables.pinkred },
                                        }}
                                    />
                                    <p>{guestCount}</p>
                                    <AddCircleOutline
                                        onClick={() => {
                                            setGuestCount(guestCount + 1);
                                        }}
                                        sx={{
                                            fontSize: "25px",
                                            cursor: "pointer",
                                            "&:hover": { color: variables.pinkred },
                                        }}
                                    />
                                </div>
                            </div>

                            <div className="basic">
                                <p>Dormitoare</p>
                                <div className="basic_count">
                                    <RemoveCircleOutline
                                        onClick={() => {
                                            bedroomCount > 1 && setBedroomCount(bedroomCount - 1);
                                        }}
                                        sx={{
                                            fontSize: "25px",
                                            cursor: "pointer",
                                            "&:hover": { color: variables.pinkred },
                                        }}
                                    />
                                    <p>{bedroomCount}</p>
                                    <AddCircleOutline
                                        onClick={() => {
                                            setBedroomCount(bedroomCount + 1);
                                        }}
                                        sx={{
                                            fontSize: "25px",
                                            cursor: "pointer",
                                            "&:hover": { color: variables.pinkred },
                                        }}
                                    />
                                </div>
                            </div>

                            <div className="basic">
                                <p>Paturi</p>
                                <div className="basic_count">
                                    <RemoveCircleOutline
                                        onClick={() => {
                                            bedCount > 1 && setBedCount(bedCount - 1);
                                        }}
                                        sx={{
                                            fontSize: "25px",
                                            cursor: "pointer",
                                            "&:hover": { color: variables.pinkred },
                                        }}
                                    />
                                    <p>{bedCount}</p>
                                    <AddCircleOutline
                                        onClick={() => {
                                            setBedCount(bedCount + 1);
                                        }}
                                        sx={{
                                            fontSize: "25px",
                                            cursor: "pointer",
                                            "&:hover": { color: variables.pinkred },
                                        }}
                                    />
                                </div>
                            </div>

                            <div className="basic">
                                <p>Băi</p>
                                <div className="basic_count">
                                    <RemoveCircleOutline
                                        onClick={() => {
                                            bathroomCount > 1 && setBathroomCount(bathroomCount - 1);
                                        }}
                                        sx={{
                                            fontSize: "25px",
                                            cursor: "pointer",
                                            "&:hover": { color: variables.pinkred },
                                        }}
                                    />
                                    <p>{bathroomCount}</p>
                                    <AddCircleOutline
                                        onClick={() => {
                                            setBathroomCount(bathroomCount + 1);
                                        }}
                                        sx={{
                                            fontSize: "25px",
                                            cursor: "pointer",
                                            "&:hover": { color: variables.pinkred },
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="create-listing_step2">
                        <h2>Pasul 2: Fă locația ta să iasă în evidență</h2>
                        <hr />

                        <h3>Spune-le oaspeților ce are locația ta de oferit</h3>
                        <div className="amenities">
                            {facilities?.map((item, index) => (
                                <div
                                    className={`facility ${amenities.includes(item.name) ? "selected" : ""
                                        }`}
                                    key={index}
                                    onClick={() => handleSelectAmenities(item.name)}
                                >
                                    <div className="facility_icon">{item.icon}</div>
                                    <p>{item.name}</p>
                                </div>
                            ))}
                        </div>

                        <h3>Adaugă câteva fotografii ale locației tale</h3>
                        <DragDropContext onDragEnd={handleDragPhoto}>
                            <Droppable droppableId="photos" direction="horizontal">
                                {(provided) => (
                                    <div
                                        className="photos"
                                        {...provided.droppableProps}
                                        ref={provided.innerRef}
                                    >
                                        {photos.length < 1 && (
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
                                                    <p>Încarcă de pe dispozitivul tău</p>
                                                </label>
                                            </>
                                        )}

                                        {photos.length >= 1 && (
                                            <>
                                                {photos.map((photo, index) => {
                                                    return (
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
                                                                        src={URL.createObjectURL(photo)}
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
                                                    );
                                                })}
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
                                                    <p>Încarcă de pe dispozitivul tău</p>
                                                </label>
                                            </>
                                        )}
                                    </div>
                                )}
                            </Droppable>
                        </DragDropContext>

                        <h3>Ce face locația ta atrăgătoare?</h3>
                        <div className="description">
                            <p>Titlu</p>
                            <input
                                type="text"
                                placeholder="Titlu"
                                name="title"
                                value={formDescription.title}
                                onChange={handleChangeDescription}
                                required
                            />
                            <p>Descriere</p>
                            <textarea
                                type="text"
                                placeholder="Descriere"
                                name="description"
                                value={formDescription.description}
                                onChange={handleChangeDescription}
                                required
                            />
                            <p>Descriere pe scurt</p>
                            <textarea
                                type="text"
                                placeholder="Descriere pe scurt"
                                name="highlight"
                                value={formDescription.highlight}
                                onChange={handleChangeDescription}
                                required
                            />
                            <p>Acum, stabilește-ți PREȚUL</p>
                            <span>ron</span>
                            <input
                                type="number"
                                placeholder="100"
                                name="price"
                                value={formDescription.price}
                                onChange={handleChangeDescription}
                                className="price"
                                required
                            />
                        </div>
                    </div>

                    <button className="submit_btn" type="submit">
                        CREAZĂ ANUNȚUL TĂU
                    </button>
                </form>
            </div>

            <Footer />
        </>
    );
};

export default CreateListing;