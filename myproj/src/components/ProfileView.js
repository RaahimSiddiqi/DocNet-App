import React, { useState, useEffect, useContext } from 'react';
import { View, Image, StyleSheet, ImageBackground, useWindowDimensions, ScrollView, Alert, FlatList, Keyboard } from 'react-native'
import { Text, TextInput, Button, Title, Paragraph, FAB, useTheme} from 'react-native-paper';
import DropDownPicker from 'react-native-dropdown-picker';
import { FastField, useFormik, Formik, useFormikContext } from 'formik';
import * as yup from 'yup';
import { MemoInputComponent } from './utils/MemoInputField';
import { DatePickerModal } from 'react-native-paper-dates';
import { themeContext } from '../context';
import { calculate_age } from './utils/UtilFunctions';

const schema = yup.object({
    firstName: yup.string()
        .max(30)
        .required("Required"),
    lastName: yup.string()
        .required("Required"),
    email: yup.string()
        .email()
        .required("Required"),
    dob: yup.date()
        .required("Required"),
    gender: yup.string()
        .required("Required"),
    city: yup.string()
        .required("Required")
        .max(30, "Max Length Exceeded"),
    about: yup.string()
        .max(1000)
})

const ProfileView = ({ toggleProfileMode, userDetails, profileMode, updateUserDetails }) => {
    let isAlertActive = 0;
    const {theme} = useContext(themeContext);
    const styles = createStyles(theme);

    const date = new Date();
    const [editMode, setEditMode] = React.useState(profileMode);
    const [showDropDown, setShowDropDown] = useState(false);
    const [datePickerOpen, setDatePickerOpen] = React.useState(false);
    const [age, setAge] = useState(null);

    const openDatePicker = () => {
        Keyboard.dismiss();
        setDatePickerOpen(true);
    }

    useEffect(() => {
        if (userDetails && userDetails.dob) {
            const [year, month, day] = userDetails.dob.split('T')[0].split('-');
            setAge(calculate_age(year, month, day).toString());
        }
    }, [])

    const [genderList, setGenderList] = useState([
        { label: "Male", value: "male" },
        { label: "Female", value: "female" },
        { label: "Others", value: "others" },
    ]);

    const showAlert = () => {
        isAlertActive = 1;
        Alert.alert(
            "Confirmation",
            "Are you sure you want to discard your changes without saving?",
            [
                {
                    text: "No",
                    onPress: () => console.log("exit"),
                },
                { text: "Yes", onPress: _toggleEditMode }
            ]
        ), isAlertActive = 1;
    }

    const onDismissDatePicker = React.useCallback(() => {
        setDatePickerOpen(false);
      }, [setDatePickerOpen]);

    const onConfirmDatePicker = React.useCallback(
        (params, setFieldValue) => {
          setDatePickerOpen(false);
          setFieldValue("dob",params.date.toISOString().split('T')[0])

          d = params.date.toISOString().split('T')[0]
          console.log(calculate_age(d.split('-')[0], d.split('-')[1], d.split('-')[2]))
          setAge(calculate_age(d.split('-')[0], d.split('-')[1], d.split('-')[2]).toString())
        },
        [setDatePickerOpen]
      );

    const toggleEditMode = (dirty) => {
        if (dirty && isAlertActive == 0)
            showAlert()
        else
            _toggleEditMode();
    }

    const _toggleEditMode = () => {
        setEditMode(!editMode);
        toggleProfileMode();
    }

    return (
        <>
        {userDetails &&
            <Formik
                validateOnChange={false}
                validateOnBlur={false}
                initialValues={{
                    firstName: userDetails.firstName ? userDetails.firstName  : "",
                    lastName: userDetails.lastName ? userDetails.lastName: "",
                    email: userDetails.email ? userDetails.email: "",
                    dob: userDetails.dob ? userDetails.dob: "",
                    gender: userDetails.gender ? userDetails.gender: "",
                    city: userDetails.city ? userDetails.city: "",
                    about: userDetails.about ? userDetails.about: "",
                }}
                validationSchema={schema}
                onSubmit={(values) => {
                    Keyboard.dismiss();
                    _toggleEditMode();
                    updateUserDetails(values);
                }}>
                {({
                    values,
                    errors,
                    handleChange,
                    handleSubmit,
                    setFieldValue,
                    dirty
                }) => (
                    <>
                    <FAB
                        color="white"
                        icon={editMode == 0 ? "pencil" : "pencil-off"}
                        style={{...styles.fab, backgroundColor: theme.colors.secondary}}
                        onPress={() => toggleEditMode(dirty)}
                    />
                    <View style={styles.root}>
                        <ScrollView keyboardShouldPersistTaps='handled' showsVerticalScrollIndicator={false}>
                            <View style={{ ...styles.row, flexDirection: "row", width: '100%' }}>
                                <View style={{ width: '50%', paddingRight: 10 }}>
                                    <MemoInputComponent disabled={editMode} 
                                                   name ={"firstName"} 
                                                   label="Firstname"
                                                   styles={styles.input}
                                                   textColor={styles.text_medium.color}
                                                   labeltextstyles={styles.text_small}
                                                   />
                                    {errors.firstName && <Text style={{ ...styles.error }} variant='bodySmall'>{errors.firstName}</Text>}
                                </View>

                                <View style={{ width: '50%', paddingLeft: 10 }}>
                                    <MemoInputComponent disabled={editMode} 
                                                   name ={"lastName"} 
                                                   label="Lastname"
                                                   styles={styles.input}
                                                   textColor={styles.text_medium.color}
                                                   labeltextstyles={styles.text_small}
                                                   />
                                    {errors.lastName && <Text style={{ ...styles.error }} variant='bodySmall'>{errors.lastName}</Text>}
                                </View>
                            </View>

                            <View style={{ ...styles.row }}>
                                <MemoInputComponent disabled={editMode} 
                                                   name ={"email"} 
                                                   label="Email"
                                                   styles={styles.input}
                                                   textColor={styles.text_medium.color}
                                                   labeltextstyles={styles.text_small}
                                                   />
                                {errors.email && <Text style={{ ...styles.error }} variant='bodySmall'>{errors.email}</Text>}
                            </View>

                            <View style={{ ...styles.row, flexDirection: "row", width: '100%' }}>
                                <View style={{ width: '42%', marginRight: '8%' }}>
                                    <TextInput style={{ ...styles.input }}
                                        value={age}
                                        editable={false}
                                        label={<Text style={styles.text_small}>Age</Text>}
                                        textColor={styles.text_medium.color}
                                        disabled
                                    ></TextInput>
                                    {errors.age && <Text style={{ ...styles.error }} variant='bodySmall'>{errors.age}</Text>}
                                </View>

                                <View style={{ width: '42%', marginLeft: '8%', paddingTop: 5 }}>
                                    <DropDownPicker disabledStyle={{ opacity: 0.6,  borderColor: "lightgrey" }}
                                        placeholder="Gender"
                                        label="gender"
                                        listMode="SCROLLVIEW"
                                        open={showDropDown}
                                        value={values.gender}
                                        items={genderList}
                                        setOpen={setShowDropDown}
                                        setValue={item => setFieldValue("gender", item())}
                                        setItems={setGenderList}
                                        disabled={editMode == true ? false : true}
                                    />
                                    {errors.gender && <Text style={{ ...styles.error }} variant='bodySmall'>{errors.gender}</Text>}
                                </View>
                            </View>

                            <View style={{ ...styles.row, flexDirection: "row", width: '100%' }}>
                                <View style={{ width: '42%', marginRight: '8%' }}>
                                    <TextInput style={{ ...styles.input }}
                                        textColor = {theme.colors.primaryText}
                                        onFocus = {openDatePicker}
                                        editable={true}
                                        value = {values.dob}
                                        label={<Text style={styles.text_small}>D.O.B</Text>}
                                        disabled
                                    ></TextInput>
                                    <DatePickerModal
                                        locale="en"
                                        mode="single"
                                        visible={datePickerOpen}
                                        date = {date}
                                        onDismiss={onDismissDatePicker}
                                        onConfirm={(params) => onConfirmDatePicker(params, setFieldValue)}
                                        saveLabel={<Text style={{color:"white"}}>Save</Text>}
                                        startYear={1920}
                                        endYear={2023}
                                        />
                                    {errors.dob && <Text style={{ ...styles.error }} variant='bodySmall'>{errors.dob}</Text>}
                                </View>

                                <View style={{ width: '42%', marginLeft: '8%' }}>
                                    <MemoInputComponent disabled={editMode} 
                                                        name ={"city"} 
                                                        label="City" 
                                                        styles={styles.input}  
                                                        textColor={styles.text_medium.color}
                                                        labeltextstyles={styles.text_small}
                                                        />
                                    {errors.city && <Text style={{ ...styles.error }} variant='bodySmall'>{errors.city}</Text>}
                                </View>
                            </View>

                            {userDetails && userDetails.userRole == "DOCTOR" &&
                                <View style={{ ...styles.doctorView }}>
                                    <Text style={styles.text_medium}>Certification Details</Text>
                                    <View style={{ ...styles.row }}>
                                        <TextInput style={{ ...styles.input, marginBottom: 10 }}
                                            value={userDetails.degreeTitle}
                                            label={<Text style={styles.text_small}>Certification</Text>}
                                            textColor = {theme.colors.primaryText}
                                            disabled
                                        ></TextInput>

                                        <TextInput style={{ ...styles.input, marginTop: 10, marginBottom: 10 }}
                                            value={userDetails.instituteName}
                                            label={<Text style={styles.text_small}>Institute Name</Text>}
                                            textColor = {theme.colors.primaryText}
                                            disabled
                                        ></TextInput>

                                        <View style={{flexDirection:"row"}}>
                                            <TextInput style={{ ...styles.input, marginRight: 10, marginTop: 10, marginBottom: 10, width:'50%' }}
                                                value={userDetails.startDate.split('T')[0]}
                                                label={<Text style={styles.text_small}>Start Date</Text>}
                                                textColor = {theme.colors.primaryText}
                                                disabled
                                            ></TextInput>

                                            <TextInput style={{ ...styles.input, marginTop: 10, marginLeft: 10, marginBottom: 10, width:'50%' }}
                                                value={userDetails.endDate.split('T')[0]}
                                                label={<Text style={styles.text_small}>End Date</Text>}
                                                textColor = {theme.colors.primaryText}
                                                disabled
                                            ></TextInput>
                                        </View>
                                    </View>
                                </View>
                            }

                            <View style={{ ...styles.row, paddblackingTop: 20 }}>
                                <Text  style={{ ...styles.text_medium }}>About Me</Text>
                                <TextInput style={{ ...styles.multiline_input }}
                                    onChangeText={handleChange('about')}
                                    value={values.about}
                                    editable={editMode == 1 ? true : false}
                                    multiline
                                    mode="outlined"
                                    numberOfLines={4}
                                    disabled={editMode == true ? false : true}
                                    textColor={theme.colors.primaryText}
                                ></TextInput>
                                {errors.about && <Text style={{ ...styles.error, ...styles.text_small }} variant='bodySmall'>{errors.about}</Text>}
                            </View>

                            {editMode == 1 &&
                                <Button buttonColor={theme.colors.primaryButton} onPress={handleSubmit} style={{ ...styles.button }} mode='contained'>
                                    Save Changes
                                </Button>}

                            <View style={{ paddingBottom: 75 }}></View>
                        </ScrollView>
                    </View>
                    </>
                )}</Formik>}
        </>
    );
}

export default React.memo(ProfileView);


const createStyles = ({colors}) => StyleSheet.create({
    root: {
        flex: 1,
        paddingTop: 10,
        paddingRight: 25,
        paddingLeft: 25,
        backgroundColor: colors.primaryContainer
    },
    centerX: {
        marginLeft: 'auto',
        marginRight: 'auto'
    },
    error: {
        color: "red",
        fontStyle: "italic"
    },
    row: {
        paddingTop: 12,
        paddingBottom: 12
    },
    input: {
        includeFontPadding: false,
        padding: 0,
        margin: 0,
        backgroundColor: colors.secondaryContainer,
        color: 'gray'
    },
    multiline_input: {
        height: 150,
        maxHeight: 180,
        backgroundColor: colors.secondaryContainer,
        color: 'gray'
    },
    fab: {
        position: 'absolute',
        margin: 16,
        right: 0,
        bottom: 0,
        zIndex: 99,
    },
    button: {
        marginTop: 10,
        marginBottom: 20,
        borderRadius: 5,
    },
    doctorView: {
        marginTop: 40,
        marginBottom: 40,
    },
    heading: {
        color: colors.primaryText,
        fontSize:20
    },
    text_medium : {
        color: colors.primaryText,
        fontSize:16
    },
    text_small : {
        color: colors.primaryText,
        fontSize:14
    },
})