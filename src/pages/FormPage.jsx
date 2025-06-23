import { useState } from "react";
import { useForm } from '../libs/hooks/useForm.mjs';
import { useInvalidField } from "../libs/hooks/useInvalidField.mjs";
import { useNotifier } from "../libs/hooks/useNotifier.mjs";
import { ChannelType, NotificationType } from "../constants/notificationOptions.mjs";
import { ERROR_SUBMIT } from "../constants/formMessages.mjs";
import Form from "../components/molecules/Form/Form.jsx";
import Notifier from "../components/molecules/Notifier/Notifier.jsx";
import Spinner from "../components/molecules/Spinner/Spinner.jsx";

export default function FormPage({ onSaveAvailablePlace }) {
    const [name, setName] = useState('');
    const [loadingSave, setLoadingSave] = useState(false);
    const { showForm, handleToggleForm } = useForm();
    const { notification, notify, reset } = useNotifier();
    const { invalidation, handleHasInvalidation, hasAnyInvalidation, clearAllValidations } = useInvalidField();
    
    const handleSubmitPlace = (event) => {
        event.preventDefault();
        
        //Activo el loading
        setLoadingSave(true)

        const formData = new FormData(event.target);
    
        const name = formData.get('name');
        const imageFile = formData.get('image');
    
        if(hasAnyInvalidation()) {
            notify(ERROR_SUBMIT, NotificationType.ERROR);
            return;
        }
    
        const place = {
            name,
            image: {
                src: URL.createObjectURL(imageFile),
                alt: name
            },
            default: false
        };
    
        onSaveAvailablePlace(place)
            .then(res => {
                if(res.succes) {
                    notify(res.succes, res.type)
                }

                if(res.error) {
                    notify(res.error, res.type)
                }
            })
            .finally(() => setLoadingSave(false))
        
        //Vaciar las validaciones realizadas
        clearAllValidations();
        setName('');
        event.target.reset();
    }
    
    return (
        <section>
            <button onClick={handleToggleForm}>Abrir formulario</button>
            {showForm && 
                <div>
                    {loadingSave && <Spinner/>}
                    {notification && (
                        <Notifier notification={notification} channel={ChannelType.MODAL} reset={reset}/>
                    )}
                    
                    <Form 
                        name={name} 
                        onChangeName={setName} 
                        invalidation={invalidation} 
                        onValidation={handleHasInvalidation} 
                        onSubmit={handleSubmitPlace} 
                    />
                </div>
            }
        </section>
    )
}