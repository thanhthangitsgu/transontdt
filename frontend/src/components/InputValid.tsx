import { useState } from "react";

type props = {
    label: string,
    name: string,
    onChangeData: Function,
    value: string,
    isValid: boolean,
    alert: string,
    disabled: boolean,
    text?: string
}
export default function InputValid({ label, name, value, onChangeData, isValid, alert, disabled, text }: props) {
    const [isAction, setIsAction] = useState<boolean>(false);

    function onChangeInput(event: React.FormEvent<HTMLInputElement>): void {
        setIsAction(true)
        let _value = event.currentTarget.value;
        onChangeData(name, _value);
    }

    return (
        <div className="input-valid mt-2">
            <div className="dialog-row">
                <div className="input-valid__label flex">
                    <label htmlFor="">{label} </label> {!isValid && isAction && (<div className="input-alert">{alert}</div>)}
                </div>
                <div className="input-wrapper">
                    <input type={text ? text : 'text'} name={name} value={value} onChange={onChangeInput} disabled = {disabled}/>
                </div>
            </div>
        </div>
    )
}