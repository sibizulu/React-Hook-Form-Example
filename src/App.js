import React from 'react'
import { Input } from 'baseui/input'
import { Button } from 'baseui/button'
import { Select } from 'baseui/select'
import { FormControl } from 'baseui/form-control'
import { useForm, Controller, useWatch, useFieldArray } from 'react-hook-form'
import { styled } from 'baseui'

const FieldWrapper = styled('div', {
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: 'hsla(0, 0%, 0%, 0.24)',
    padding: '15px',
    marginBottom: '15px'
})
const FieldItem = styled('div', {
    marginBottom: '10px'
})

const OptionWrapper = styled('div', {
    display: 'flex',
    flexWrap: 'wrap'
})
const OptionItem = styled('div', {
    width: '200px',
    marginRight: '10px'
})

const defaultValue = [
    { name: 'Initial', type: [{ label: 'About', id: 'about' }] }
]

const App = () => {
    const formName = 'sample'
    const { handleSubmit, control, register } = useForm({
        defaultValues: { [formName]: defaultValue },
        mode: 'onSubmit'
    })
    const {
        fields,
        append,
        prepend,
        remove,
        swap,
        move,
        insert
    } = useFieldArray({
        control,
        name: formName
    })

    const testing = 0

    if (testing) {
        return (
            <div
                className="nested"
                style={{ backgroundColor: 'grey', paddingLeft: '20px' }}>
                <ul>
                    {fields.map((item, index) => {
                        console.log('item', index)
                        return (
                            <li key={item.id}>
                                <input
                                    placeholder={`${formName}[${index}].name`}
                                    name={`${formName}[${index}].name`}
                                    defaultValue={`${item.name}`}
                                    ref={register({})}
                                />

                                <button
                                    type="button"
                                    onClick={() => remove(index)}>
                                    Delete
                                </button>
                            </li>
                        )
                    })}
                </ul>
                <section>
                    <button
                        type="button"
                        onClick={() => {
                            append({ name: 'append nested' })
                        }}>
                        append nested
                    </button>
                    <button
                        type="button"
                        onClick={() => prepend({ name: 'prepend nested' })}>
                        prepend nested
                    </button>
                    <button
                        type="button"
                        onClick={() =>
                            insert(parseInt(2, 10), { name: 'insert nested' })
                        }>
                        insert at nested
                    </button>

                    <button type="button" onClick={() => swap(1, 2)}>
                        swap nested
                    </button>

                    <button type="button" onClick={() => move(1, 4)}>
                        move nested
                    </button>

                    <button type="button" onClick={() => remove(1)}>
                        remove at nested
                    </button>
                </section>
            </div>
        )
    }

    return (
        <form onSubmit={handleSubmit(data => console.log(data))}>
            {fields.map((item, index) => {
                return (
                    <FieldWrapper key={item.id}>
                        <FieldItem>
                            <Controller
                                render={({ onChange, value, ref }) => (
                                    <FormControl
                                        label={() => 'Name'}
                                        caption={() => ''}>
                                        <Input
                                            value={value}
                                            inputRef={ref}
                                            onChange={onChange}
                                        />
                                    </FormControl>
                                )}
                                name={`${formName}[${index}].name`}
                                defaultValue={`${item.name}`}
                                control={control}
                            />
                        </FieldItem>
                        <ConditionalFields
                            namePrefix={`${formName}[${index}]`}
                            control={control}
                            defaultValue={item}
                        />
                    </FieldWrapper>
                )
            })}

            <Button
                type="button"
                onClick={() =>
                    append({
                        name: 'append nested',
                        type: [{ label: 'Hobbies', id: 'hobbies' }]
                    })
                }
                overrides={{
                    BaseButton: {
                        style: ({ $theme }) => ({
                            outline: `${$theme.colors.positive} solid`,
                            backgroundColor: $theme.colors.positive,
                            marginRight: $theme.sizing.scale700
                        })
                    }
                }}>
                Append
            </Button>
            <Button
                type="button"
                onClick={() =>
                    prepend({
                        name: 'prepend nested',
                        type: [{ label: 'About', id: 'about' }]
                    })
                }
                overrides={{
                    BaseButton: {
                        style: ({ $theme }) => ({
                            outline: `${$theme.colors.positive} solid`,
                            backgroundColor: $theme.colors.positive,
                            marginRight: $theme.sizing.scale700
                        })
                    }
                }}>
                Prepend
            </Button>
            <Button
                overrides={{
                    BaseButton: {
                        style: ({ $theme }) => ({
                            outline: `${$theme.colors.positive} solid`,
                            backgroundColor: $theme.colors.positive
                        })
                    }
                }}>
                Save
            </Button>
        </form>
    )
}

const ConditionalFields = ({ control, namePrefix, defaultValue }) => {
    const watchData = useWatch({
        control,
        name: `${namePrefix}.type`,
        defaultValue: defaultValue.type
    })

    return (
        <>
            <FieldItem>
                <Controller
                    control={control}
                    name={`${namePrefix}.type`}
                    defaultValue={defaultValue.type}
                    render={({ onChange, value, ref }) => (
                        <FormControl
                            label={() => 'Add information'}
                            caption={() => ''}>
                            <Select
                                options={[
                                    { label: 'About', id: 'about' },
                                    { label: 'Hobbies', id: 'hobbies' }
                                ]}
                                value={value}
                                innerRef={ref}
                                onChange={params => onChange(params.value)}
                            />
                        </FormControl>
                    )}
                />
            </FieldItem>

            {watchData[0].id === 'about' && (
                <FieldItem>
                    <Controller
                        render={({ onChange, value, ref }) => (
                            <FormControl
                                label={() => 'About'}
                                caption={() => ''}>
                                <Input
                                    value={value}
                                    inputRef={ref}
                                    onChange={onChange}
                                />
                            </FormControl>
                        )}
                        name={`${namePrefix}.about`}
                        defaultValue={defaultValue.about || 'here we go'}
                        control={control}
                    />
                </FieldItem>
            )}

            {watchData[0].id === 'hobbies' && (
                <OptionsRender
                    namePrefix={`${namePrefix}.hobbies`}
                    control={control}
                    defaultValue={defaultValue.hobbies || ''}
                />
            )}
        </>
    )
}

const OptionsRender = ({ control, namePrefix, defaultValue }) => {
    const { fields, append, remove } = useFieldArray({
        control,
        name: namePrefix
    })

    return (
        <>
            <OptionWrapper>
                {fields.map((item, index) => {
                    console.log('itemitemitemitem', item)
                    return (
                        <FieldItem key={item.id}>
                            <OptionItem>
                                <Controller
                                    render={({ onChange, value, ref }) => (
                                        <FormControl
                                            label={() => 'Name'}
                                            caption={() => ''}>
                                            <Input
                                                value={value}
                                                inputRef={ref}
                                                onChange={onChange}
                                            />
                                        </FormControl>
                                    )}
                                    name={`${namePrefix}[${index}].hobby`}
                                    defaultValue={`${item.name}`}
                                    control={control}
                                />
                            </OptionItem>
                        </FieldItem>
                    )
                })}
            </OptionWrapper>
            <Button
                type="button"
                onClick={() =>
                    append({
                        name: `Append ${fields.length + 1}`
                    })
                }>
                Add More
            </Button>
        </>
    )
}
export default App
