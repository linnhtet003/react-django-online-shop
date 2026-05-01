from rest_framework import serializers
from .models import CustomUser, Categories, NeworPopular, Products, Review, Order

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = '__all__'

class UserCreateSerailizer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['id', 'email', 'name']

class UserDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['id', 'name', 'email', 'user_profile']

# class UserCreateSerailizer(serializers.ModelSerializer):
#     password = serializers.CharField(write_only=True)   # we never want to return it back in API responses, even after registration.
#                                                         # You can write (send) it from the frontend.  But it will not be shown in API responses.

#     class Meta:
#         model = CustomUser
#         fields = ['id', 'email', 'name', 'password']

#     def create(self, validated_data):
#         return CustomUser.objects.create_user(
#             email = validated_data['email'],
#             name = validated_data['name'],
#             password = validated_data['password']
#         )

class CategorySerailizer(serializers.ModelSerializer):
    class Meta:
        model = Categories
        fields = '__all__'

class NeworPuSerializer(serializers.ModelSerializer):
    class Meta:
        model = NeworPopular
        fields = '__all__'

class ProductsSerializer(serializers.ModelSerializer):
    # popular_or_new = NeworPuSerializer(read_only = True)

    popular_or_new = serializers.PrimaryKeyRelatedField(
        queryset = NeworPopular.objects.all(), write_only = True
    )       # Allows writing category using a Category ID (like category: 1).
            # ✅ Used during POST/PUT (creating/updating a product).
            # ❌ Not shown in GET responses.
            # This allows clients to send something like:
            # {
            #   "popular_or_new": 2
            # }

    category = serializers.PrimaryKeyRelatedField(
        queryset = Categories.objects.all(), write_only = True
    )

    # Use nested read-only for reading
    popular_or_new_data = serializers.SerializerMethodField(read_only = True)       # These fields are used to display nested, detailed info when sending data back to the client.
    category_data = serializers.SerializerMethodField(read_only = True)
    def get_popular_or_new_data(self, obj):
        if obj.popular_or_new:
            return{
                "id": obj.popular_or_new.id,
                "name": obj.popular_or_new.name,
                "color": obj.popular_or_new.color,
            }
        return None

    def get_category_data(self, obj): # this is define method       obj: A Products instance
        if obj.category: # It accesses the related category object (ForeignKey).
            return{
                "id": obj.category.id,
                "name": obj.category.name,
            }
        return None


    class Meta:
        model = Products
        fields = '__all__'

class ReviewsSerializer(serializers.ModelSerializer):
    created_by = serializers.PrimaryKeyRelatedField(
        queryset = CustomUser.objects.all(),
        write_only = True,
        required = False
    )

    created_by_data = serializers.SerializerMethodField(read_only = True)
    def get_created_by_data(self, obj):
        request = self.context.get('request')
        if obj.created_by:
            profile_url = obj.created_by.user_profile.url if obj.created_by.user_profile else None  # user_profile is an ImageField.     .url gives the relative path to the image:
            if request:
                profile_url = request.build_absolute_uri(profile_url)   # build_absolute_uri() takes /media/userprofile/avatar.svg
            return{
                "id": obj.created_by.id,
                "name": obj.created_by.name,
                "user_profile": profile_url,
            }
    class Meta:
        model = Review
        fields = '__all__'

class OrderSerializer(serializers.ModelSerializer):
    user = UserDetailSerializer(read_only=True)

    class Meta:
        model = Order
        fields = ['id', 'user', 'name', 'phone', 'address', 'total_price', 'cart_items', 'created_at']
        # read_only_fields = ['user']