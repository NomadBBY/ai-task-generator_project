import unittest
import sys
from io import StringIO

class TestPrintHelloWorld(unittest.TestCase):
    def setUp(self):
        # Replace sys.stdout with a StringIO object for the duration of the test
        self.captured_output = StringIO()
        sys.stdout = self.captured_output

    def tearDown(self):
        # Reset sys.stdout to its original value after the test
        sys.stdout = sys.__stdout__

    def test_print_hello_world(self):
        print("Hello World")
        self.assertEqual(self.captured_output.getvalue(), "Hello World\n")

if __name__ == '__main__':
    unittest.main()
