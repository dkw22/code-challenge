from collections import OrderedDict


def test_api_parse_succeeds(client):
    # TODO: Finish this test. Send a request to the API and confirm that the
    # data comes back in the appropriate format.
    address_string = '123 main st chicago il'
    response = client.get('/api/parse/?address=' + address_string)
    assert response.data['status'] == 'success'
    assert response.data['input_string'] == '123 main st chicago il'
    assert response.data['address_type'] == 'Street Address'
    assert response.data['address_components'] == OrderedDict([
        ('AddressNumber', '123'),
        ('StreetName', 'main'),
        ('StreetNamePostType', 'st'),
        ('PlaceName', 'chicago'),
        ('StateName', 'il')
    ])
    # pytest.fail()


def test_api_parse_raises_error(client):
    # TODO: Finish this test. The address_string below will raise a
    # RepeatedLabelError, so ParseAddress.parse() will not be able to parse it.
    address_string = '123 main st chicago il 123 main st'
    response = client.get('/api/parse/?address=' + address_string)
    assert response.data['status'] == 'RepeatedLabelError'
    # pytest.fail()
