import { MdManageAccounts } from "react-icons/md";
import styles from './style.module.css'
import { useState, useRef, useEffect } from "react";

function ManageCategories() {

    // fill dropdown
    const [refresh, setRefresh] = useState(true)
    const [categories, setCategories] = useState([])
    async function getAllCategories() {
        const url = "http://localhost/SharingPlatform/api.php/Categories";
        try {
            const response = await fetch(url)
            if (!response.ok) throw new Error("");
            const data = await response.json()
            if (data) {
                setCategories(data)
            }
        }
        catch (error) {
            setError(error.message)
        }
    }
    useEffect(() => { if (refresh) getAllCategories() }, [refresh])

    const category = useRef(null)
    const newCategory = useRef(null)

    // delete category (removed)
    function handleDelete() {
        let submittedId = category.current.value;
        if (submittedId) {
            const url = "http://localhost/SharingPlatform/api.php/Categories/" + submittedId;
            try {
                setRefresh(false)
                const response = fetch(url,
                    {
                        method: "DELETE",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({ Id: submittedId }),
                    }
                )
                if (!response.ok) throw new Error("Failed To Delete")
                setRefresh(true)
            }
            catch (error) {
                console.log(error.message)
            }
        }
    }

    // add category
    function handleAdd() {
        let submittedCategory = newCategory.current.value;
        if (submittedCategory) {
            const url = "http://localhost/SharingPlatform/api.php/Categories";
            try {
                setRefresh(false)
                const response = fetch(url,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({ Name: submittedCategory }),
                    }
                )
                if (!response.ok) throw new Error("Failed To Delete")
                setRefresh(true)
            }
            catch (error) {
                console.log(error.message)
            }
        }
    }

    return (
        <section className={styles.categoriesContainer}>

            <h2><p>Manage Categories</p><MdManageAccounts /></h2>

            <form className={styles.form}>

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
                    <button className={styles.button} onClick={handleAdd}>Add</button>
                </div>

            </form>

        </section>
    )


}

export default ManageCategories