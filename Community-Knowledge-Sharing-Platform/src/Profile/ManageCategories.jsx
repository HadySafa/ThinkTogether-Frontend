import { MdManageAccounts } from "react-icons/md";
import styles from './style.module.css'
import MyContext from "../Context";
import { useNavigate } from "react-router-dom";
import { useRef, useEffect, useContext } from "react";

function ManageCategories() {

    const { token ,role, setRefreshCategories, categories} = useContext(MyContext);
    const navigate = useNavigate(null)
    useEffect(() => {
        if (!token) {
            navigate('/');
        }
        else if(role != "Manager"){
            navigate('/Profile');
        }
    }, []);

    const category = useRef(null)
    const newCategory = useRef(null)

    // add category
    async function handleAdd(e) {
        e.preventDefault()
        let submittedCategory = newCategory.current.value;
        if (submittedCategory) {
            const url = "http://localhost/SharingPlatform/api.php/Categories";
            try {
                setRefreshCategories(false)
                const response = await fetch(url,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({ Name: submittedCategory }),
                    }
                )
                if (!response.ok) throw new Error("Failed To Add")
                e.target.reset()
                setRefreshCategories(true)
            }
            catch (error) {
                // handle error
            }
        }
    }

    return (
        <section className={styles.categoriesContainer}>

            <h2><p>Manage Categories</p><MdManageAccounts /></h2>

            <form onSubmit={handleAdd} className={styles.form}>

                <div>
                    <select name='Category' ref={category} className={styles.dropdown}>
                        <option value="">-- View All Categories --</option>
                        {
                            categories && categories.length > 0
                                ? categories.map((object, index) => <option key={index} value={object.Id}>{object.Name}</option>)
                                : null
                        }
                    </select>
                </div>

                <div>
                    <input ref={newCategory} className={styles.inputCategory} placeholder="New category" type="text" />
                    <button className={styles.button}>Add</button>
                </div>

            </form>

        </section>
    )


}

export default ManageCategories