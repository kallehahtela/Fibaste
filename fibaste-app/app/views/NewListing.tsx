import { View, Text, StyleSheet, Pressable, } from 'react-native';
import { FC, useState } from 'react';
import FormInput from '@ui/FormInput';
import { FontAwesome5, AntDesign } from '@expo/vector-icons';
import colors from '@utils/colors';
import DatePicker from '@ui/DatePicker';
import OptionModal from '@components/OptionModal';
import categories from '@utils/categories';
import CategoryOption from '@ui/CategoryOption';
import AppButton from '@ui/AppButton';
import CustomKeyAvoidingView from '@ui/CustomKeyAvoidingView';
import * as ImagePicker from 'expo-image-picker';
import { showMessage } from 'react-native-flash-message';
import HorizontalImageList from '@components/HorizontalImageList';
import { newTaskSchema, yupValidate } from '@utils/validator';
import mime from 'mime';
import useClient from 'app/hooks/useClient';
import { runAxiosAsync } from 'app/api/runAxiosAsync';
import LoadingSpinner from '@ui/LoadingSpinner';

interface Props {}

const defaultInfo = {
  name: '',
  description: '',
  category: '',
  price: '',
  publishingDate: new Date(),
};

const imageOptions = [{ value: 'Remove Image', id: 'remove' }];

const NewListing: FC<Props> = (props) => {
  const [taskInfo, setTaskInfo] = useState({ ...defaultInfo });
  const [busy, setBusy] = useState(false)
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showImageOptions, setShowImageOptions] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [selectedImage, setSelectedImage] = useState('');
  const { authClient } = useClient();

  const { name, description, category, price, publishingDate } = taskInfo;

  const handleChange = (name: string) => (text: string) => {
    setTaskInfo({ ...taskInfo, [name]: text });
  };

  const handleSubmit = async () => {
    const { error } = await yupValidate(newTaskSchema, taskInfo);
    if (error) return showMessage({ message: error, type: "danger" });

    setBusy(true);
    // submit this form
    const formData = new FormData();

    type productInfoKeys = keyof typeof taskInfo;

    for (let key in taskInfo) {
      const value = taskInfo[key as productInfoKeys];

      if (value instanceof Date) formData.append(key, value.toISOString());
      else formData.append(key, value);
    }

    // appending images
    const newImages = images.map((img, index) => ({
      name: "image_" + index,
      type: mime.getType(img),
      uri: img,
    }));

    for (let img of newImages) {
      formData.append("images", img as any);
    }

    const res = await runAxiosAsync<{ message: string }>(
      authClient.post("/product/create-task", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
    );
    setBusy(false);

    if (res) {
      showMessage({ message: res.message, type: "success" });
      setTaskInfo({ ...defaultInfo });
      setImages([]);
    }

    console.log(res);
  };

  const handleOnImageSelection = async () => {
    try {
      const { assets } = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: false,
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.3,
        allowsMultipleSelection: true,
      })

      if (!assets) return;

      const imagesUris = assets.map(({ uri }) => uri);
      setImages([...images, ...imagesUris]);
    } catch (error) {
      showMessage({message: (error as any).message, type: 'danger'});
    }
  }

  return (
    <CustomKeyAvoidingView>
      <View style={styles.container}>
        <View style={styles.imageContainer}>
          <Pressable 
            onPress={handleOnImageSelection} 
            style={styles.fileSelector}
          >
              <View style={styles.iconContainer}>
                  <FontAwesome5 name="images" size={24} color={colors.primary} />
              </View>
              <Text style={styles.btnTitle}>Add Images</Text>
          </Pressable>

          <HorizontalImageList 
            images={images} 
            onLongPress={(img) => {
              setSelectedImage(img);
              setShowImageOptions(true);
            }}
          />
        </View>

        <FormInput 
          value={name} 
          placeholder='Task name' 
          onChangeText={handleChange('name')}
        />
        <FormInput 
          value={price} 
          placeholder='Price'
          onChangeText={handleChange('price')}
          keyboardType='numeric'
        />
        <DatePicker 
          title='Publishing Date: ' 
          value={publishingDate} 
          onChange={(publishingDate) => setTaskInfo({...taskInfo, publishingDate})}
        />

        <Pressable 
          style={styles.category} 
          onPress={() => setShowCategoryModal(true)}
        >
          <Text style={styles.categoryTitle}>{category || 'Category' }</Text>
          <AntDesign name='caretdown' color={colors.primary} />
        </Pressable>
        
        <FormInput 
          value={description} 
          placeholder='Description' 
          multiline numberOfLines={4}
          onChangeText={handleChange('description')}  
        />

        <AppButton 
          title='List Task' 
          onPress={() => {
            console.log('New task listed...');
            handleSubmit();
          }} 
        />

        <OptionModal 
          visible={showCategoryModal}
          onRequestClose={setShowCategoryModal}
          options={categories}
          renderItem={(item) => {
            return (
              <CategoryOption {...item} />
            );
          }}
          onPress={(item) => {
            setTaskInfo({ ...taskInfo, category: item.name});
          }}
        />

        {/* Image Options */}
        <OptionModal 
            visible={showImageOptions} 
            onRequestClose={setShowImageOptions}
            options={imageOptions}
            renderItem={(item) => {
              return (
                <Text style={styles.imageOption}>{item.value}</Text>
              );
            }}
            onPress={(option) => {
              if (option.id === 'remove') {
                const newImages = images.filter(img => img !== selectedImage);
                setImages([...newImages]);
              }
            }}
          />
      </View>
      <LoadingSpinner visible={busy}/>
    </CustomKeyAvoidingView>
  );
};

const styles = StyleSheet.create({
    container: {
        padding: 15,
        flex: 1,
    },
    imageContainer: {
      flexDirection: 'row',
    },
    btnTitle: {
       color: colors.primary,
       marginTop: 5,
    },
    fileSelector: {
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 15,
        alignSelf: 'flex-start',
    },
    iconContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        width: 70,
        height: 70,
        borderWidth: 2,
        borderColor: colors.primary,
        borderRadius: 7,
    },
    imageOption: {
      fontWeight: '600', 
      fontSize: 18, 
      color: colors.primary, 
      padding: 10,
    },
    category: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      width: '100%',
      marginBottom: 15,
      padding: 8,
      borderWidth: 1,
      borderColor: colors.deActive,
      borderRadius: 5,
    },
    categoryTitle: {
      color: colors.primary,
    },
});

export default NewListing;