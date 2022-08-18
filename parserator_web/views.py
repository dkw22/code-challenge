import usaddress
from django.views.generic import TemplateView
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.renderers import JSONRenderer


class Home(TemplateView):
    template_name = 'parserator_web/index.html'


class AddressParse(APIView):
    renderer_classes = [JSONRenderer]

    def get(self, request):
        # TODO: Flesh out this method to parse an address string using the
        # parse() method and return the parsed components to the frontend.
        input_string = request.GET.get('address')
        try:
            parse_return = self.parse(input_string)
            address_components = parse_return[0]
            address_type = parse_return[1]
            return Response({
                'status': 'success',
                'input_string': input_string,
                'address_components': address_components,
                'address_type': address_type
            })
        # this will check for common error in the provided input such as multiple
        # areas of the input has the same labels and the address is not valid.
        except usaddress.RepeatedLabelError as error:
            return Response({
                'status': 'RepeatedLabelError',
                'input_string': error.original_string,
                'parsed_string': error.parsed_string
            })

    def parse(self, address):
        # TODO: Implement this method to return the parsed components of a
        # given address using usaddress: https://github.com/datamade/usaddress
        # tag method returns a tuple with parsed address as an ordered dict
        # and then the type of address that was provided
        # i seperated the tuple into address_components and address_type
        # so it will be easier in the get method
        input_address = usaddress.tag(address)
        address_components = input_address[0]
        address_type = input_address[1]
        return address_components, address_type
